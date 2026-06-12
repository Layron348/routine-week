import React from "react";
import { StatsResponse } from "../types";

interface Props { stats: StatsResponse; }

export const StreakPanel: React.FC<Props> = ({ stats }) => {
  const today = new Date().toISOString().split("T")[0];
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (stats.percent / 100) * circumference;

  return (
    <>
      <div className="stats-row">
        <div className="ring-wrap">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle className="ring-bg" cx="40" cy="40" r="34" />
            <circle
              className="ring-fill"
              cx="40" cy="40" r="34"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="ring-text">
            <span className="ring-percent">{stats.percent}%</span>
            <span className="ring-sub">неделя</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card s-done">
            <div className="val">✅ {stats.done}</div>
            <div className="lbl">Сделано</div>
          </div>
          <div className="stat-card s-total">
            <div className="val">📋 {stats.total}</div>
            <div className="lbl">Всего</div>
          </div>
        </div>
      </div>

      <div className="week-chart">
        {stats.by_day.map((d) => (
          <div key={d.date} className="bar-col">
            <div className="bar-track">
              <div
                className={`bar-fill${d.date === today ? " today" : ""}`}
                style={{ height: `${d.percent}%` }}
              />
            </div>
            <span className="bar-label">{d.weekday}</span>
          </div>
        ))}
      </div>
    </>
  );
};
