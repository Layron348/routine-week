import React from "react";
import "./styles.css";
import { usePlan } from "./hooks/usePlan";
import { Header } from "./components/Header";
import { StreakPanel } from "./components/StreakPanel";
import { WeekTimeline } from "./components/WeekTimeline";

export default function App() {
  const { plan, stats, loading, error, toggleTask } = usePlan();

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
          {error ?? "Что-то пошло не так"}
          <br />
          <small>Убедись, что backend запущен на :8000</small>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <StreakPanel stats={stats} />
      <WeekTimeline plan={plan} onToggle={toggleTask} />
    </div>
  );
}
