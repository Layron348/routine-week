export interface Task {
  id: number;
  date: string;
  category: "work" | "train" | "project" | "rest" | "routine";
  title: string;
  done: boolean;
  shift: string | null;
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

export interface StatsResponse {
  streak: number;
  total: number;
  done: number;
  percent: number;
}
