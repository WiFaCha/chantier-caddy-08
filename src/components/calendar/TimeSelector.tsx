import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TimeSelectorProps {
  scheduleId: string;
  currentTime?: string;
  onTimeChange: (scheduleId: string, time: string) => void;
}

export function TimeSelector({ scheduleId, currentTime, onTimeChange }: TimeSelectorProps) {
  const [time, setTime] = useState(currentTime || "");

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    onTimeChange(scheduleId, newTime);
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
      <PopoverContent className="w-auto p-2">
        <Input
          type="time"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-32"
        />
      </PopoverContent>
    </Popover>
  );
}