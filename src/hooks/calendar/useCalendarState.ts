import { useState } from 'react';

export function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "twoWeeks">("month");

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
  };
}