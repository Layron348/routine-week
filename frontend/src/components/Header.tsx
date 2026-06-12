import React from "react";

interface Props { streak: number; }

export const Header: React.FC<Props> = ({ streak }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  const weekday = ["вс","пн","вт","ср","чт","пт","сб"][today.getDay()];

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="brand-icon">📅</div>
        <span className="brand-name">Routine Week</span>
      </div>
      <div className="topbar-right">
        <div className="date-chip">{weekday}, {dateStr}</div>
        <div className="streak-pill">🔥 {streak}</div>
      </div>
    </div>
  );
};
