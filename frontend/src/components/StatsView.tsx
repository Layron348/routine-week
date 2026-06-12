import React from "react";
import { StatsResponse, PlanResponse } from "../types";

interface Props {
  stats: StatsResponse;
  plan: PlanResponse;
}

const CAT_CONFIG = [
  { key: "work",    emoji: "💼", label: "Работа",     color: "var(--work)" },
  { key: "train",   emoji: "🏋️", label: "Тренировки", color: "var(--train)" },
  { key: "project", emoji: "🚀", label: "Проект",     color: "var(--project)" },
  { key: "rest",    emoji: "😴", label: "Отдых",      color: "var(--rest)" },
  { key: "routine", emoji: "☀️", label: "Рутина",     color: "var(--routine)" },
];

export const StatsView: React.FC<Props> = ({ stats, plan }) => {
  const today = new Date().toISOString().split("T")[0];
  const allTasks = plan.days.flatMap(d => d.tasks);

  // Category breakdown
  const catStats = CAT_CONFIG.map(c => ({
    ...c,
    total: allTasks.filter(t => t.category === c.key).length,
    done:  allTasks.filter(t => t.category === c.key && t.done).length,
  })).filter(c => c.total > 0);

  return (
    <div className="stats-view">
      <p className="stats-section-title">По дням недели</p>
      <div className="stats-day-list">
        {stats.by_day.map(d => (
          <div key={d.date} className={`stats-day-row${d.date === today ? " today-row" : ""}`}>
            <span className="stats-day-name">{d.weekday}</span>
            <div className="stats-bar-bg">
              <div
                className={`stats-bar-fill${d.date === today ? " today-fill" : ""}`}
                style={{ width: `${d.percent}%` }}
              />
            </div>
            <span className="stats-day-num">{d.done}/{d.total}</span>
          </div>
        ))}
      </div>

      {catStats.length > 0 && (
        <>
          <p className="stats-section-title">По категориям</p>
          <div className="cat-list">
            {catStats.map(c => (
              <div key={c.key} className="cat-card">
                <span className="cat-icon">{c.emoji}</span>
                <div className="cat-info">
                  <div className="cat-name">{c.label}</div>
                  <div className="cat-val" style={{ color: c.color }}>
                    {c.done}<span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>/{c.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="stats-section-title">Итого за неделю</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "🔥 Стрик", val: `${stats.streak} дн`, color: "#f97316" },
          { label: "✅ Сделано", val: stats.done, color: "var(--train)" },
          { label: "📊 Прогресс", val: `${stats.percent}%`, color: "var(--accent)" },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign: "center" }}>
            <div className="val" style={{ color: s.color, fontSize: 20 }}>{s.val}</div>
            <div className="lbl" style={{ marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
