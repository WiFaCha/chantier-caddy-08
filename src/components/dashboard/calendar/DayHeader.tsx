import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DayHeaderProps {
  date: Date;
  isMobile: boolean;
}

export function DayHeader({ date, isMobile }: DayHeaderProps) {
  return (
    <div className={`${isMobile ? 'text-lg font-medium mb-4' : 'text-sm font-medium mb-3'}`}>
      {format(date, isMobile ? "EEEE d MMMM" : "EEEE d MMMM", { locale: fr })}
    </div>
  );
}