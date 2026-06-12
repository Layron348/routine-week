import React from "react";

export const Header: React.FC = () => {
  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="header">
      <h1>📅 Routine Week</h1>
      <p className="subtitle">{today}</p>
    </header>
  );
};
