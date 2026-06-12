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
      const [planRes, statsRes] = await Promise.all([
        fetch(`${BASE}/plan`),
        fetch(`${BASE}/stats`),
      ]);
      if (!planRes.ok || !statsRes.ok) throw new Error("API error");
      const [planData, statsData] = await Promise.all([
        planRes.json(),
        statsRes.json(),
      ]);
      setPlan(planData);
      setStats(statsData);
      setError(null);
    } catch (e) {
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const toggleTask = async (taskId: number) => {
    try {
      const res = await fetch(`${BASE}/tasks/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId }),
      });
      if (!res.ok) throw new Error("toggle failed");
      await fetchAll();
    } catch {
      setError("Не удалось обновить задачу");
    }
  };

  const addTask = async (date: string, title: string, category: string) => {
    try {
      const res = await fetch(`${BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, title, category }),
      });
      if (!res.ok) throw new Error("create failed");
      await fetchAll();
    } catch {
      setError("Не удалось создать задачу");
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const res = await fetch(`${BASE}/tasks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId }),
      });
      if (!res.ok) throw new Error("delete failed");
      await fetchAll();
    } catch {
      setError("Не удалось удалить задачу");
    }
  };

  return { plan, stats, loading, error, toggleTask, addTask, deleteTask, refresh: fetchAll };
}
