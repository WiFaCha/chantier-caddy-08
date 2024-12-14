import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";
import { ScheduledProject } from "@/types/calendar";
import { TimeSelector } from "../../calendar/TimeSelector";

interface ProjectItemProps {
  project: ScheduledProject;
  index: number;
  isMobile: boolean;
  onToggleComplete: (scheduleId: string) => void;
  onDeleteProject: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
}

export function ProjectItem({
  project,
  index,
  isMobile,
  onToggleComplete,
  onDeleteProject,
  onTimeChange
}: ProjectItemProps) {
  const isWindowCleaningMonth = () => {
    if (!project.window_cleaning) return false;
    const currentMonth = (project.date.getMonth() + 1).toString();
    return project.window_cleaning.includes(currentMonth);
  };

  return (
    <Draggable
      key={project.scheduleId}
      draggableId={project.scheduleId}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center justify-between rounded-lg p-3 ${isMobile ? 'text-sm' : 'text-xs'} text-white ${
            project.color === "violet"
              ? "bg-violet-500"
              : project.color === "blue"
              ? "bg-blue-500"
              : project.color === "green"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Checkbox
              checked={project.completed}
              onCheckedChange={() => onToggleComplete(project.scheduleId)}
              className="h-4 w-4 bg-white/20 border-white/40 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
            <div className="truncate flex flex-col gap-1">
              <span className="truncate">
                {project.title}
              </span>
              <div className="flex items-center gap-2">
                {project.time && (
                  <span className="text-xs flex items-center gap-1 opacity-80">
                    <div className="w-2 h-2 rounded-full bg-green-300"></div>
                    {project.time}
                  </span>
                )}
                {isWindowCleaningMonth() && (
                  <span className="text-xs flex items-center gap-1 opacity-80">
                    <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                    Vitres
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TimeSelector
              scheduleId={project.scheduleId}
              currentTime={project.time}
              onTimeChange={onTimeChange}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:text-white/80 shrink-0"
              onClick={() => onDeleteProject(project.scheduleId)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}