import React, { useState } from "react";
import "./styles.css";
import { usePlan } from "./hooks/usePlan";
import { Header } from "./components/Header";
import { StreakPanel } from "./components/StreakPanel";
import { TodayView } from "./components/TodayView";
import { WeekTimeline } from "./components/WeekTimeline";
import { StatsView } from "./components/StatsView";

type Tab = "today" | "week" | "stats";

export default function App() {
  const { plan, stats, loading, error, toggleTask, addTask, deleteTask } = usePlan();
  const [tab, setTab] = useState<Tab>("today");

  if (loading) {
    return (
      <div className="center-screen">
        <div className="spinner" />
        <span>Загружаем план...</span>
      </div>
    );
  }

  if (error || !plan || !stats) {
    return (
      <div className="center-screen">
        <div className="error-box">
          {error ?? "Что-то пошло не так"}<br />
          <small>Убедись, что backend запущен на :8000</small>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header streak={stats.streak} />

      <div className="tabs">
        <button className={`tab${tab === "today" ? " active" : ""}`} onClick={() => setTab("today")}>
          ☀️ Сегодня
        </button>
        <button className={`tab${tab === "week" ? " active" : ""}`} onClick={() => setTab("week")}>
          📅 Неделя
        </button>
        <button className={`tab${tab === "stats" ? " active" : ""}`} onClick={() => setTab("stats")}>
          📊 Статистика
        </button>
      </div>

      {tab !== "stats" && <StreakPanel stats={stats} />}

      <div className="section-title">
        {tab === "today" && "Задачи на сегодня"}
        {tab === "week" && "Вся неделя"}
        {tab === "stats" && "Аналитика"}
      </div>

      {tab === "today" && (
        <TodayView plan={plan} onToggle={toggleTask} onAdd={addTask} onDelete={deleteTask} />
      )}
      {tab === "week" && (
        <WeekTimeline plan={plan} onToggle={toggleTask} onAdd={addTask} onDelete={deleteTask} />
      )}
      {tab === "stats" && (
        <StatsView stats={stats} plan={plan} />
      )}
    </div>
  );
}
