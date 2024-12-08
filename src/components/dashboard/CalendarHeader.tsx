import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={onPrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="font-medium">
        {currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
      </div>
      <Button variant="outline" size="icon" onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}