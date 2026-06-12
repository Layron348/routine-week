import React, { useState } from "react";
import { DayPlan } from "../types";

interface Props {
  day: DayPlan;
  today: string;
  onToggle: (id: number) => void;
  onAdd: (date: string, title: string, category: string, priority: string, time_start: string | null, time_end: string | null, is_habit: boolean) => void;
  onDelete: (id: number) => void;
  defaultOpen?: boolean;
}

const CAT_EMOJI: Record<string, string> = {
  work: "💼", train: "🏋️", project: "🚀", rest: "😴", routine: "☀️",
};
const CATEGORIES = [
  { value: "routine", label: "☀️ Рутина" },
  { value: "project", label: "🚀 Проект" },
  { value: "work",    label: "💼 Работа" },
  { value: "train",   label: "🏋️ Тренировка" },
  { value: "rest",    label: "😴 Отдых" },
];
const PRIORITIES = [
  { value: "high",   label: "🔴 Высокий" },
  { value: "medium", label: "🟡 Средний" },
  { value: "low",    label: "⚪ Низкий" },
];

export const DayCard: React.FC<Props> = ({ day, today, onToggle, onAdd, onDelete, defaultOpen = false }) => {
  const isToday = day.date === today;
  const [open, setOpen] = useState(defaultOpen || isToday);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("routine");
  const [priority, setPriority] = useState("medium");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [isHabit, setIsHabit] = useState(false);

  const done = day.tasks.filter(t => t.done).length;
  const total = day.tasks.length;

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(day.date, title.trim(), category, priority, timeStart || null, timeEnd || null, isHabit);
    setTitle(""); setCategory("routine"); setPriority("medium");
    setTimeStart(""); setTimeEnd(""); setIsHabit(false);
    setShowForm(false);
  };

  return (
    <div className={`day-card${isToday ? " today" : ""}${!open ? " collapsed" : ""}`}>
      <div className="day-card-header" onClick={() => setOpen(o => !o)}>
        <div className="day-label">
          <span className="weekday">{day.weekday}</span>
          <span className="date-str">
            {new Date(day.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
          </span>
          {isToday && <span className="today-badge">СЕГОДНЯ</span>}
        </div>
        <div className="day-meta">
          {total > 0 && (
            <span className="day-progress-text">{done}/{total}</span>
          )}
          <span className="collapse-arrow">▼</span>
        </div>
      </div>

      <div className="day-card-tasks">
        {day.tasks.length === 0 && !showForm && (
          <p className="empty-day">Пока пусто — добавь задачу 👇</p>
        )}

        {day.tasks.map((task) => (
          <div key={task.id} className={`task-item cat-${task.category}${task.done ? " done" : ""}`}>
            <div className="task-checkbox" onClick={() => onToggle(task.id)}>
              {task.done && "✓"}
            </div>
            <div className="task-body" onClick={() => onToggle(task.id)}>
              <div className="task-title">
                {CAT_EMOJI[task.category] ?? "📌"} {task.title}
              </div>
              <div className="task-meta">
                {task.time_start && (
                  <span className="task-time">🕐 {task.time_start}{task.time_end ? `–${task.time_end}` : ""}</span>
                )}
                {task.is_habit && <span className="task-habit-badge">🔁 привычка</span>}
              </div>
            </div>
            <span className={`priority-dot ${task.priority}`} />
            <button className="task-delete" onClick={() => onDelete(task.id)} title="Удалить">×</button>
          </div>
        ))}

        {showForm && (
          <div className="add-form">
            <input
              className="add-input"
              placeholder="Название задачи..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              autoFocus
            />
            <div className="add-row">
              <select className="add-select" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select className="add-select" value={priority} onChange={e => setPriority(e.target.value)}>
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div className="add-row">
              <input className="add-input" type="time" placeholder="Начало" value={timeStart} onChange={e => setTimeStart(e.target.value)} style={{ flex: 1 }} />
              <input className="add-input" type="time" placeholder="Конец" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} style={{ flex: 1 }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text2)", cursor: "pointer" }}>
              <input type="checkbox" checked={isHabit} onChange={e => setIsHabit(e.target.checked)} />
              🔁 Повторять каждую неделю (привычка)
            </label>
            <div className="add-actions">
              <button className="btn-confirm" onClick={handleAdd}>Добавить</button>
              <button className="btn-cancel" onClick={() => { setShowForm(false); setTitle(""); }}>Отмена</button>
            </div>
          </div>
        )}

        {!showForm && (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>+ Добавить задачу</button>
        )}
      </div>
    </div>
  );
};
