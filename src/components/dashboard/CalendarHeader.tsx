import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  viewMode: "month" | "week" | "twoWeeks";
}

export function CalendarHeader({ currentDate, onPrevPeriod, onNextPeriod, viewMode }: CalendarHeaderProps) {
  const isMobile = useIsMobile();
  
  const formatPeriod = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy", { locale: fr });
    } else {
      const endDate = addDays(currentDate, viewMode === "week" ? 6 : 13);
      if (isMobile) {
        return `${format(currentDate, "d", { locale: fr })}-${format(endDate, "d MMM", { locale: fr })}`;
      }
      return `${format(currentDate, "d", { locale: fr })} - ${format(endDate, "d MMMM yyyy", { locale: fr })}`;
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm md:text-base md:gap-4">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={onPrevPeriod}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-[120px] md:min-w-[200px] text-center font-medium">
        {formatPeriod()}
      </div>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={onNextPeriod}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}