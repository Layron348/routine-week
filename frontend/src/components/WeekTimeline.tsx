import React from "react";
import { PlanResponse } from "../types";
import { DayCard } from "./DayCard";

interface Props {
  plan: PlanResponse;
  onToggle: (id: number) => void;
  onAdd: (date: string, title: string, category: string, priority: string, time_start: string | null, time_end: string | null, is_habit: boolean) => void;
  onDelete: (id: number) => void;
}

export const WeekTimeline: React.FC<Props> = ({ plan, onToggle, onAdd, onDelete }) => {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="week-timeline">
      {plan.days.map((day) => (
        <DayCard key={day.date} day={day} today={today} onToggle={onToggle} onAdd={onAdd} onDelete={onDelete} />
      ))}
    </div>
  );
};
