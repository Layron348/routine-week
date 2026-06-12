import React from "react";
import { PlanResponse } from "../types";
import { DayCard } from "./DayCard";

interface Props {
  plan: PlanResponse;
  onToggle: (id: number) => void;
}

export const WeekTimeline: React.FC<Props> = ({ plan, onToggle }) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="week-timeline">
      {plan.days.map((day) => (
        <DayCard key={day.date} day={day} today={today} onToggle={onToggle} />
      ))}
    </div>
  );
};
