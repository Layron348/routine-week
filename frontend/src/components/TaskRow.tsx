import React from "react";
import { Task, TaskStatus } from "../types";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo", in_progress: "In Progress", done: "Done", cancelled: "Cancelled",
};
const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  todo: "in_progress", in_progress: "done", done: "cancelled", cancelled: "todo",
};
const CAT_EMOJI: Record<string, string> = {
  work: "💼", train: "🏋️", project: "🚀", rest: "😴", routine: "☀️",
};

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onPatch: (id: number, patch: Record<string, unknown>) => void;
  onDelete: (id: number) => void;
  showCat?: boolean;
}

export const TaskRow: React.FC<Props> = ({ task, onToggle, onPatch, onDelete, showCat = false }) => (
  <div className={`task-row cat-${task.category} status-${task.status}${task.done ? " done" : ""}`}
    onClick={() => onToggle(task.id)}>
    <div className="task-check">{task.done && "✓"}</div>
    <div className="task-info">
      <div className="task-name">{CAT_EMOJI[task.category]} {task.title}</div>
      <div className="task-sub">
        {task.time_start && (
          <span className="task-time">🕐 {task.time_start}{task.time_end ? `–${task.time_end}` : ""}</span>
        )}
        {showCat && (
          <span className={`task-cat-badge ${task.category}`}>{task.category}</span>
        )}
        {task.is_habit && <span className="habit-tag">🔁</span>}
      </div>
    </div>
    <span className={`prio-dot ${task.priority}`} />
    <span className={`status-badge ${task.status}`}
      onClick={e => { e.stopPropagation(); onPatch(task.id, { status: STATUS_CYCLE[task.status] }); }}>
      {STATUS_LABELS[task.status]}
    </span>
    <button className="task-del" onClick={e => { e.stopPropagation(); onDelete(task.id); }}>×</button>
  </div>
);
