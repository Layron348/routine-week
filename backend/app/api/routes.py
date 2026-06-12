from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.task import Task
from app.services.schedule import seed_week, get_week_start
from app.services.streak import compute_streak, compute_week_stats

router = APIRouter()

# ──────────────────────────────────────
# Schemas
# ──────────────────────────────────────
class TaskOut(BaseModel):
    id: int
    date: date
    category: str
    title: str
    done: bool
    status: str          # todo | in_progress | done | cancelled
    shift: str | None
    priority: str
    time_start: str | None
    time_end: str | None
    is_habit: bool

    model_config = {"from_attributes": True}


class DayPlan(BaseModel):
    date: date
    weekday: str
    tasks: list[TaskOut]


class PlanResponse(BaseModel):
    week_start: date
    days: list[DayPlan]


class StatsResponse(BaseModel):
    streak: int
    total: int
    done: int
    percent: int
    by_day: list[dict]


class ToggleRequest(BaseModel):
    task_id: int


class PatchTaskRequest(BaseModel):
    task_id: int
    status: str | None = None
    title: str | None = None
    priority: str | None = None
    time_start: str | None = None
    time_end: str | None = None


class CreateTaskRequest(BaseModel):
    date: date
    category: str = "routine"
    title: str
    shift: str | None = None
    priority: str = "medium"
    time_start: str | None = None
    time_end: str | None = None
    is_habit: bool = False


class DeleteRequest(BaseModel):
    task_id: int


WEEKDAY_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
WEEKDAY_FULL = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]


# ──────────────────────────────────────
# Routes
# ──────────────────────────────────────
@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/plan", response_model=PlanResponse)
def get_plan(db: Session = Depends(get_db)):
    today = date.today()
    week_start = get_week_start(today)
    seed_week(db, week_start)
    days = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        tasks = db.query(Task).filter(Task.date == day).order_by(Task.id).all()
        days.append(DayPlan(
            date=day,
            weekday=WEEKDAY_RU[day.weekday()],
            tasks=[TaskOut.model_validate(t) for t in tasks],
        ))
    return PlanResponse(week_start=week_start, days=days)


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    today = date.today()
    week_start = get_week_start(today)
    seed_week(db, week_start)
    streak = compute_streak(db, today)
    week = compute_week_stats(db, week_start)
    by_day = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        tasks = db.query(Task).filter(Task.date == day).all()
        total = len(tasks)
        done = sum(1 for t in tasks if t.done)
        by_day.append({
            "weekday": WEEKDAY_RU[i],
            "weekday_full": WEEKDAY_FULL[i],
            "date": str(day),
            "total": total,
            "done": done,
            "percent": round(done / total * 100) if total else 0,
        })
    return StatsResponse(streak=streak, by_day=by_day, **week)


@router.post("/tasks/toggle", response_model=TaskOut)
def toggle_task(body: ToggleRequest, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == body.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.done = not task.done
    task.status = "done" if task.done else "todo"
    db.commit(); db.refresh(task)
    return TaskOut.model_validate(task)


@router.patch("/tasks", response_model=TaskOut)
def patch_task(body: PatchTaskRequest, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == body.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if body.status is not None:
        task.status = body.status
        task.done = body.status == "done"
    if body.title is not None:
        task.title = body.title
    if body.priority is not None:
        task.priority = body.priority
    if body.time_start is not None:
        task.time_start = body.time_start
    if body.time_end is not None:
        task.time_end = body.time_end
    db.commit(); db.refresh(task)
    return TaskOut.model_validate(task)


@router.post("/tasks", response_model=TaskOut)
def create_task(body: CreateTaskRequest, db: Session = Depends(get_db)):
    task = Task(
        date=body.date, category=body.category, title=body.title,
        shift=body.shift, priority=body.priority,
        time_start=body.time_start, time_end=body.time_end,
        is_habit=body.is_habit, done=False, status="todo",
    )
    db.add(task); db.commit(); db.refresh(task)
    if body.is_habit:
        week_start = get_week_start(body.date)
        for i in range(7):
            day = week_start + timedelta(days=i)
            if day == body.date:
                continue
            existing = db.query(Task).filter(
                Task.date == day, Task.title == body.title, Task.is_habit == True
            ).first()
            if not existing:
                db.add(Task(
                    date=day, category=body.category, title=body.title,
                    priority=body.priority, is_habit=True, done=False, status="todo",
                ))
        db.commit()
    return TaskOut.model_validate(task)


@router.delete("/tasks", response_model=TaskOut)
def delete_task(body: DeleteRequest, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == body.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task); db.commit()
    return TaskOut.model_validate(task)
