import { useState, useEffect, useCallback } from "react";
import { PlanResponse, StatsResponse } from "../types";

const BASE = "/api";

export function usePlan() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [pR, sR] = await Promise.all([fetch(`${BASE}/plan`), fetch(`${BASE}/stats`)]);
      if (!pR.ok || !sR.ok) throw new Error("API error");
      const [p, s] = await Promise.all([pR.json(), sR.json()]);
      setPlan(p); setStats(s); setError(null);
    } catch { setError("Не удалось загрузить данные"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggleTask = async (taskId: number) => {
    setPlan(prev => prev ? { ...prev, days: prev.days.map(d => ({
      ...d, tasks: d.tasks.map(t => t.id === taskId ? { ...t, done: !t.done, status: t.done ? "todo" : "done" } : t)
    }))} : prev);
    try {
      await fetch(`${BASE}/tasks/toggle`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: taskId }) });
      fetchAll();
    } catch { setError("Ошибка обновления"); }
  };

  const patchTask = async (taskId: number, patch: Record<string, unknown>) => {
    try {
      await fetch(`${BASE}/tasks`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: taskId, ...patch }) });
      fetchAll();
    } catch { setError("Ошибка изменения"); }
  };

  const addTask = async (date: string, title: string, category: string, priority = "medium", time_start: string | null = null, time_end: string | null = null, is_habit = false) => {
    try {
      const res = await fetch(`${BASE}/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date, title, category, priority, time_start, time_end, is_habit }) });
      if (!res.ok) throw new Error();
      fetchAll();
    } catch { setError("Ошибка создания задачи"); }
  };

  const deleteTask = async (taskId: number) => {
    setPlan(prev => prev ? { ...prev, days: prev.days.map(d => ({ ...d, tasks: d.tasks.filter(t => t.id !== taskId) }))} : prev);
    try {
      await fetch(`${BASE}/tasks`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: taskId }) });
      fetchAll();
    } catch { setError("Ошибка удаления"); }
  };

  return { plan, stats, loading, error, toggleTask, patchTask, addTask, deleteTask, refresh: fetchAll };
}
