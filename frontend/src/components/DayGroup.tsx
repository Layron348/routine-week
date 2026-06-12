import React, { useState } from "react";
import { DayPlan, Task } from "../types";
import { TaskRow } from "./TaskRow";
import { AddTaskForm } from "./AddTaskForm";

interface Props {
  day: DayPlan;
  today: string;
  onToggle: (id: number) => void;
  onPatch: (id: number, p: Record<string, unknown>) => void;
  onAdd: (date: string, title: string, cat: string, prio: string, ts: string|null, te: string|null, habit: boolean) => void;
  onDelete: (id: number) => void;
  defaultOpen?: boolean;
}

export const DayGroup: React.FC<Props> = ({ day, today, onToggle, onPatch, onAdd, onDelete, defaultOpen }) => {
  const isToday = day.date === today;
  const [open, setOpen] = useState(defaultOpen ?? isToday);
  const [adding, setAdding] = useState(false);

  const done = day.tasks.filter(t => t.done).length;
  const total = day.tasks.length;

  const hasTasks = total > 0;

  return (
    <div className={`day-group${!open ? " collapsed" : ""}`}>
      <div className={`day-header${!hasTasks && !adding ? " standalone" : ""}`}
        onClick={() => setOpen(o => !o)}>
        <div className="day-header-left">
          <div className={`day-dot${isToday ? " is-today" : ""}`} />
          <span className="day-wd">{day.weekday}</span>
          <span className="day-date">
            {new Date(day.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
          </span>
          {isToday && <span className="today-tag">Сегодня</span>}
        </div>
        <div className="day-header-right">
          {total > 0 && <span className="day-cnt">{done}/{total}</span>}
          <span className="day-chevron">▾</span>
        </div>
      </div>

      {(hasTasks || adding) && (
        <div className="day-tasks">
          {day.tasks.map(task => (
            <TaskRow key={task.id} task={task}
              onToggle={onToggle} onPatch={onPatch} onDelete={onDelete} />
          ))}
          {adding
            ? <AddTaskForm date={day.date} onAdd={onAdd} onClose={() => setAdding(false)} />
            : <button className="add-row-btn" onClick={e => { e.stopPropagation(); setOpen(true); setAdding(true); }}>
                + Добавить задачу
              </button>
          }
        </div>
      )}

      {!hasTasks && !adding && open && (
        <div className="day-tasks">
          <button className="add-row-btn" onClick={e => { e.stopPropagation(); setAdding(true); }}>
            + Добавить задачу
          </button>
        </div>
      )}
    </div>
  );
};
