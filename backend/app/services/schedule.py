"""
Seed the weekly plan into the DB when it's empty.
Shifts cycle: Mon=13, Tue=10, Wed=off, Thu=9, Fri=13, Sat=10, Sun=off  (adjust as needed)
Trainings: Mon, Wed, Fri
"""
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.models.task import Task

SHIFT_SCHEDULE = {
    0: "13",  # Monday
    1: "10",  # Tuesday
    2: None,  # Wednesday — free
    3: "9",   # Thursday
    4: "13",  # Friday
    5: "10",  # Saturday
    6: None,  # Sunday — free
}

TRAINING_DAYS = {0, 2, 4}  # Mon, Wed, Fri

DAY_NAMES_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]


def get_week_start(today: date) -> date:
    return today - timedelta(days=today.weekday())


def seed_week(db: Session, week_start: date):
    """Create default tasks for the week if they don't exist yet."""
    for i in range(7):
        day = week_start + timedelta(days=i)
        existing = db.query(Task).filter(Task.date == day).first()
        if existing:
            continue  # already seeded

        weekday = day.weekday()
        shift = SHIFT_SCHEDULE.get(weekday)

        # Work task
        if shift:
            db.add(Task(
                date=day,
                category="work",
                title=f"Смена с {shift}:00",
                shift=shift,
                done=False,
            ))

        # Training
        if weekday in TRAINING_DAYS:
            db.add(Task(
                date=day,
                category="train",
                title="Тренировка 💪",
                done=False,
            ))

        # Daily routine
        db.add(Task(
            date=day,
            category="routine",
            title="Утренняя рутина",
            done=False,
        ))

        # Project block (Mon–Fri)
        if weekday < 5:
            db.add(Task(
                date=day,
                category="project",
                title="Блок на проект",
                done=False,
            ))

        # Rest on free days
        if not shift:
            db.add(Task(
                date=day,
                category="rest",
                title="Отдых / восстановление",
                done=False,
            ))

    db.commit()
