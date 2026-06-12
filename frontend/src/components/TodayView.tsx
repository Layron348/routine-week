import React from "react";
import { PlanResponse } from "../types";
import { DayCard } from "./DayCard";

interface Props {
  plan: PlanResponse;
  onToggle: (id: number) => void;
  onAdd: (date: string, title: string, category: string, priority: string, time_start: string | null, time_end: string | null, is_habit: boolean) => void;
  onDelete: (id: number) => void;
}

export const TodayView: React.FC<Props> = ({ plan, onToggle, onAdd, onDelete }) => {
  const today = new Date().toISOString().split("T")[0];
  const todayPlan = plan.days.find(d => d.date === today);

  if (!todayPlan) return (
    <div className="today-view">
      <div className="today-empty">
        <div className="empty-icon">🌙</div>
        <p>Сегодняшний день не найден</p>
      </div>
    </div>
  );

  const done = todayPlan.tasks.filter(t => t.done).length;
  const total = todayPlan.tasks.length;
  const percent = total ? Math.round(done / total * 100) : 0;

  return (
    <div className="today-view">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="today-date">
          {["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"][new Date(today).getDay()]}
        </div>
        <span style={{ fontSize: 13, color: "var(--text2)" }}>{done}/{total} · {percent}%</span>
      </div>
      {total === 0 ? (
        <div className="today-empty">
          <div className="empty-icon">✨</div>
          <p>День пока пустой. Добавь задачи!</p>
        </div>
      ) : (
        <DayCard
          day={todayPlan}
          today={today}
          onToggle={onToggle}
          onAdd={onAdd}
          onDelete={onDelete}
          defaultOpen={true}
        />
      )}
    </div>
  );
};
