export interface Task {
  id: number;
  date: string;
  category: "work" | "train" | "project" | "rest" | "routine";
  title: string;
  done: boolean;
  shift: string | null;
  priority: "high" | "medium" | "low";
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
