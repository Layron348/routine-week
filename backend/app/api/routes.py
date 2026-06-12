from datetime import date, timedelta
from fastapi import APIRouter, Depends
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
    shift: str | None

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


class ToggleRequest(BaseModel):
    task_id: int


class CreateTaskRequest(BaseModel):
    date: date
    category: str = "routine"
    title: str
    shift: str | None = None


class DeleteRequest(BaseModel):
    task_id: int


WEEKDAY_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]


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
    return StatsResponse(streak=streak, **week)


@router.post("/tasks/toggle", response_model=TaskOut)
def toggle_task(body: ToggleRequest, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == body.task_id).first()
    if not task:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Task not found")
    task.done = not task.done
    db.commit()
    db.refresh(task)
    return TaskOut.model_validate(task)


@router.post("/tasks", response_model=TaskOut)
def create_task(body: CreateTaskRequest, db: Session = Depends(get_db)):
    task = Task(
        date=body.date,
        category=body.category,
        title=body.title,
        shift=body.shift,
        done=False,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return TaskOut.model_validate(task)


@router.delete("/tasks", response_model=TaskOut)
def delete_task(body: DeleteRequest, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == body.task_id).first()
    if not task:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return TaskOut.model_validate(task)
