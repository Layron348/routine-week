import React from "react";
import { StatsResponse } from "../types";

interface Props {
  stats: StatsResponse;
}

export const StreakPanel: React.FC<Props> = ({ stats }) => (
  <>
    <div className="streak-panel">
      <div className="stat-card streak">
        <div className="value">🔥 {stats.streak}</div>
        <div className="label">Стрик</div>
      </div>
      <div className="stat-card done-stat">
        <div className="value">{stats.done}/{stats.total}</div>
        <div className="label">Задачи</div>
      </div>
      <div className="stat-card percent">
        <div className="value">{stats.percent}%</div>
        <div className="label">Прогресс</div>
      </div>
    </div>
    <div className="progress-wrap">
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${stats.percent}%` }}
        />
      </div>
    </div>
  </>
);
