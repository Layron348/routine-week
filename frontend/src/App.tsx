import React, { useState } from "react";
import "./styles.css";
import { usePlan } from "./hooks/usePlan";
import { Header } from "./components/Header";
import { StreakPanel } from "./components/StreakPanel";
import { DayGroup } from "./components/DayGroup";
import { BoardView } from "./components/BoardView";
import { StatsView } from "./components/StatsView";

type Tab = "today" | "week" | "board" | "stats";

export default function App() {
  const { plan, stats, loading, error, toggleTask, patchTask, addTask, deleteTask } = usePlan();
  const [tab, setTab] = useState<Tab>("today");
  const today = new Date().toISOString().split("T")[0];

  if (loading) return (
    <div className="center-screen"><div className="spinner" /><span>Загружаем...</span></div>
  );
  if (error || !plan || !stats) return (
    <div className="center-screen">
      <div className="error-box">{error ?? "Ошибка"}<br /><small>Убедись что backend запущен на :8000</small></div>
    </div>
  );

  const todayPlan = plan.days.find(d => d.date === today);

  return (
    <div className="app">
      <Header streak={stats.streak} />

      <div className="nav-tabs">
        {([
          { id: "today", icon: "☀️", label: "Сегодня" },
          { id: "week",  icon: "📅", label: "Неделя"  },
          { id: "board", icon: "⚡", label: "Board"    },
          { id: "stats", icon: "📊", label: "Аналитика"},
        ] as { id: Tab; icon: string; label: string }[]).map(t => (
          <button key={t.id} className={`nav-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab !== "board" && <StreakPanel stats={stats} />}

      <div className="section-hd">
        <span className="section-hd-title">
          {tab === "today" && "Задачи на сегодня"}
          {tab === "week"  && "Эта неделя"}
          {tab === "board" && "Board — все задачи"}
          {tab === "stats" && "Аналитика"}
        </span>
      </div>

      {tab === "today" && todayPlan && (
        <div style={{ padding: "0 18px" }}>
          <DayGroup day={todayPlan} today={today}
            onToggle={toggleTask} onPatch={patchTask} onAdd={addTask} onDelete={deleteTask}
            defaultOpen={true} />
        </div>
      )}

      {tab === "week" && (
        <div style={{ padding: "0 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {plan.days.map(d => (
            <DayGroup key={d.date} day={d} today={today}
              onToggle={toggleTask} onPatch={patchTask} onAdd={addTask} onDelete={deleteTask} />
          ))}
        </div>
      )}

      {tab === "board" && (
        <BoardView plan={plan} onToggle={toggleTask} onPatch={patchTask} onDelete={deleteTask} />
      )}

      {tab === "stats" && (
        <StatsView stats={stats} plan={plan} />
      )}
    </div>
  );
}
