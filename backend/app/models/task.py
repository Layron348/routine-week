from sqlalchemy import Column, Integer, String, Boolean, Date
from app.db import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)          # YYYY-MM-DD
    category = Column(String, nullable=False)                 # work | train | project | rest | routine
    title = Column(String, nullable=False)
    done = Column(Boolean, default=False, nullable=False)
    shift = Column(String, nullable=True)                     # "13" | "10" | "9" | null
