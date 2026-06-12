export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type TaskPriority = "high" | "medium" | "low";
export type TaskCategory = "work" | "train" | "project" | "rest" | "routine";

export interface Task {
  id: number;
  date: string;
  category: TaskCategory;
  title: string;
  done: boolean;
  status: TaskStatus;
  shift: string | null;
  priority: TaskPriority;
  time_start: string | null;
  time_end: string | null;
  is_habit: boolean;
}

export interface DayPlan {
  date: string;
  weekday: string;
  tasks: Task[];
}

export interface PlanResponse {
  week_start: string;
  days: DayPlan[];
}

export interface DayStat {
  weekday: string;
  weekday_full: string;
  date: string;
  total: number;
  done: number;
  percent: number;
}

export interface StatsResponse {
  streak: number;
  total: number;
  done: number;
  percent: number;
  by_day: DayStat[];
}
