import React, { useState } from "react";
import { DayPlan, Task } from "../types";

interface Props {
  day: DayPlan;
  today: string;
  onToggle: (id: number) => void;
  onAdd: (date: string, title: string, category: string) => void;
  onDelete: (id: number) => void;
}

const CAT_EMOJI: Record<string, string> = {
  work: "💼",
  train: "🏋️",
  project: "🚀",
  rest: "😴",
  routine: "☀️",
};

const CATEGORIES = [
  { value: "routine", label: "☀️ Рутина" },
  { value: "project", label: "🚀 Проект" },
  { value: "work", label: "💼 Работа" },
  { value: "train", label: "🏋️ Тренировка" },
  { value: "rest", label: "😴 Отдых" },
];

export const DayCard: React.FC<Props> = ({ day, today, onToggle, onAdd, onDelete }) => {
  const isToday = day.date === today;
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("routine");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(day.date, title.trim(), category);
    setTitle("");
    setCategory("routine");
    setShowForm(false);
  };

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
        {day.tasks.length === 0 && !showForm ? (
          <p className="empty-day">Задач нет</p>
        ) : (
          day.tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item${task.done ? " done" : ""}`}
            >
              <span
                className={`cat-dot ${task.category}`}
                onClick={() => onToggle(task.id)}
              />
              <span
                className="task-title"
                onClick={() => onToggle(task.id)}
              >
                {CAT_EMOJI[task.category] ?? "📌"} {task.title}
              </span>
              <span
                className="task-check"
                onClick={() => onToggle(task.id)}
              >
                {task.done ? "✓" : ""}
              </span>
              <button
                className="task-delete"
                onClick={() => onDelete(task.id)}
                title="Удалить"
              >
                ×
              </button>
            </div>
          ))
        )}

        {showForm && (
          <div className="add-form">
            <input
              className="add-input"
              placeholder="Название задачи..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
            />
            <select
              className="add-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <div className="add-actions">
              <button className="btn-confirm" onClick={handleAdd}>Добавить</button>
              <button className="btn-cancel" onClick={() => { setShowForm(false); setTitle(""); }}>Отмена</button>
            </div>
          </div>
        )}

        {!showForm && (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>
            + Добавить задачу
          </button>
        )}
      </div>
    </div>
  );
};
