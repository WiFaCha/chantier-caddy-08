import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

interface TimeSelectorProps {
  scheduleId: string;
  currentTime?: string;
  currentSection?: 'morning' | 'afternoon';
  onTimeChange: (scheduleId: string, time: string) => void;
  onSectionChange: (scheduleId: string, section: 'morning' | 'afternoon') => void;
}

export function TimeSelector({ 
  scheduleId, 
  currentTime, 
  currentSection = 'morning',
  onTimeChange,
  onSectionChange 
}: TimeSelectorProps) {
  const [time, setTime] = useState(currentTime || "");
  const [section, setSection] = useState<'morning' | 'afternoon'>(currentSection);

  useEffect(() => {
    if (time) {
      const hour = parseInt(time.split(':')[0]);
      const newSection = hour >= 12 ? 'afternoon' : 'morning';
      if (newSection !== section) {
        setSection(newSection);
        onSectionChange(scheduleId, newSection);
      }
    }
  }, [time, section, scheduleId, onSectionChange]);

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    onTimeChange(scheduleId, newTime);
  };

  const handleSectionChange = (checked: boolean) => {
    const newSection = checked ? 'afternoon' : 'morning';
    setSection(newSection);
    onSectionChange(scheduleId, newSection);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:text-white/80 shrink-0"
        >
          <Clock className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-4">
        <div className="space-y-2">
          <select
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Sélectionner</option>
            {Array.from({ length: 17 }, (_, i) => i + 6).map((hour) => {
              return [0, 15, 30, 45].map((minute) => {
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                const timeValue = `${formattedHour}:${formattedMinute}`;
                return (
                  <option key={timeValue} value={timeValue}>
                    {timeValue}
                  </option>
                );
              });
            })}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Après-midi</span>
          <Switch
            checked={section === 'afternoon'}
            onCheckedChange={handleSectionChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}