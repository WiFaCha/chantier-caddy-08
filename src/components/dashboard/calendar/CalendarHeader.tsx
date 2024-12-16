import { CardTitle } from "@/components/ui/card";
import { CalendarNavigation } from "../CalendarNavigation";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: "month" | "week" | "twoWeeks";
  setViewMode: (mode: "month" | "week" | "twoWeeks") => void;
  setCurrentDate: (date: Date) => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  setViewMode,
  setCurrentDate
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-0 flex-wrap gap-4">
      <CardTitle>Calendrier</CardTitle>
      <CalendarNavigation
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrevPeriod={() => {
          const newDate = new Date(currentDate);
          if (viewMode === "month") {
            newDate.setMonth(currentDate.getMonth() - 1);
          } else {
            const days = viewMode === "week" ? 7 : 14;
            newDate.setDate(currentDate.getDate() - days);
          }
          setCurrentDate(newDate);
        }}
        onNextPeriod={() => {
          const newDate = new Date(currentDate);
          if (viewMode === "month") {
            newDate.setMonth(currentDate.getMonth() + 1);
          } else {
            const days = viewMode === "week" ? 7 : 14;
            newDate.setDate(currentDate.getDate() + days);
          }
          setCurrentDate(newDate);
        }}
      />
    </div>
  );
}