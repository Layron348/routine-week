import React from "react";

interface Props {
  streak: number;
}

export const Header: React.FC<Props> = ({ streak }) => {
  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <header className="header">
      <div className="header-left">
        <h1>Routine Week</h1>
        <p className="subtitle">{today}</p>
      </div>
      <div className="streak-badge">
        <span className="fire">🔥</span>
        <span className="streak-num">{streak}</span>
        <span className="streak-label">стрик</span>
      </div>
    </header>
  );
};
