import React from "react";
import { StatsResponse, PlanResponse } from "../types";

const CAT_CONFIG = [
  { k: "work",    e: "💼", l: "Работа",     c: "var(--cat-work)" },
  { k: "train",   e: "🏋️", l: "Тренировки", c: "var(--cat-train)" },
  { k: "project", e: "🚀", l: "Проект",     c: "var(--cat-project)" },
  { k: "rest",    e: "😴", l: "Отдых",      c: "var(--cat-rest)" },
  { k: "routine", e: "☀️", l: "Рутина",     c: "var(--cat-routine)" },
];

interface Props { stats: StatsResponse; plan: PlanResponse; }

export const StatsView: React.FC<Props> = ({ stats, plan }) => {
  const today = new Date().toISOString().split("T")[0];
  const allTasks = plan.days.flatMap(d => d.tasks);
  const cats = CAT_CONFIG.map(c => ({
    ...c,
    total: allTasks.filter(t => t.category === c.k).length,
    done:  allTasks.filter(t => t.category === c.k && t.done).length,
  })).filter(c => c.total > 0);

  return (
    <div className="stats-view">
      <div className="stats-block">
        <div className="stats-block-title">Прогресс по дням</div>
        {stats.by_day.map(d => (
          <div key={d.date} className="stats-day-row">
            <span className="sdr-name">{d.weekday}</span>
            <div className="sdr-bar">
              <div className={`sdr-fill${d.date === today ? " today" : ""}`}
                style={{ width: `${d.percent}%` }} />
            </div>
            <span className="sdr-num">{d.done}/{d.total}</span>
          </div>
        ))}
      </div>

      {cats.length > 0 && (
        <div className="stats-block">
          <div className="stats-block-title">По категориям</div>
          <div className="cat-grid">
            {cats.map(c => (
              <div key={c.k} className="cat-item">
                <span className="cat-item-icon">{c.e}</span>
                <div>
                  <div className="cat-item-name">{c.l}</div>
                  <div className="cat-item-val" style={{ color: c.c }}>
                    {c.done}<span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 400 }}>/{c.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-block">
        <div className="stats-block-title">Итоги недели</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { l: "🔥 Стрик",   v: `${stats.streak} дн`, c: "#fb923c" },
            { l: "✅ Сделано", v: String(stats.done),    c: "var(--green)" },
            { l: "📊 Общий",   v: `${stats.percent}%`,   c: "var(--accent-h)" },
          ].map(s => (
            <div key={s.l} className="cat-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
              <div className="cat-item-val" style={{ color: s.c }}>{s.v}</div>
              <div className="cat-item-name">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
