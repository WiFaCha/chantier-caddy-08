import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarHeader } from "./CalendarHeader";

interface CalendarNavigationProps {
  currentDate: Date;
  viewMode: "month" | "week" | "twoWeeks";
  onViewModeChange: (value: "month" | "week" | "twoWeeks") => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
}

export function CalendarNavigation({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevPeriod,
  onNextPeriod,
}: CalendarNavigationProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Select value={viewMode} onValueChange={onViewModeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sélectionner la vue" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Mois</SelectItem>
          <SelectItem value="week">Semaine</SelectItem>
          <SelectItem value="twoWeeks">Deux semaines</SelectItem>
        </SelectContent>
      </Select>
      <CalendarHeader
        currentDate={currentDate}
        onPrevPeriod={onPrevPeriod}
        onNextPeriod={onNextPeriod}
        viewMode={viewMode}
      />
    </div>
  );
}