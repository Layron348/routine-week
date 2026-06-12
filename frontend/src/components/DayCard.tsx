import React from "react";
import { DayPlan, Task } from "../types";

interface Props {
  day: DayPlan;
  today: string;
  onToggle: (id: number) => void;
}

const CAT_EMOJI: Record<Task["category"], string> = {
  work: "💼",
  train: "🏋️",
  project: "🚀",
  rest: "😴",
  routine: "☀️",
};

export const DayCard: React.FC<Props> = ({ day, today, onToggle }) => {
  const isToday = day.date === today;

  return (
    <div className={`day-card${isToday ? " today" : ""}`}>
      <div className="day-card-header">
        <div className="day-label">
          <span className="weekday">{day.weekday}</span>
          <span className="date-str">
            {new Date(day.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
        {isToday && <span className="today-badge">СЕГОДНЯ</span>}
      </div>

      <div className="day-card-tasks">
        {day.tasks.length === 0 ? (
          <p className="empty-day">Задач нет</p>
        ) : (
          day.tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item${task.done ? " done" : ""}`}
              onClick={() => onToggle(task.id)}
            >
              <span className={`cat-dot ${task.category}`} />
              <span className="task-title">
                {CAT_EMOJI[task.category]} {task.title}
              </span>
              <span className="task-check">{task.done ? "✓" : ""}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
