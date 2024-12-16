import { Button } from "@/components/ui/button";
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
  onSectionChange: (scheduleId: string, section: 'morning' | 'afternoon') => void;
}

export function ProjectItem({
  project,
  index,
  isMobile,
  onToggleComplete,
  onDeleteProject,
  onTimeChange,
  onSectionChange
}: ProjectItemProps) {
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
          className={`flex flex-col gap-2 rounded-lg p-3 ${isMobile ? 'text-sm' : 'text-xs'} text-white ${
            project.color === "violet"
              ? "bg-violet-500"
              : project.color === "blue"
              ? "bg-blue-500"
              : project.color === "green"
              ? "bg-green-500"
              : project.color === "red"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        >
          <div className="space-y-1">
            <div className="truncate font-medium">
              {project.title}
            </div>
            <div className="flex items-center gap-2 text-[10px] opacity-90">
              {project.window_cleaning && project.window_cleaning.length > 0 && (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200"></span>
                  Vitres
                </span>
              )}
              {project.time && (
                <span>{project.time}</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => onSectionChange(project.scheduleId, project.section === 'morning' ? 'afternoon' : 'morning')}
              className="text-[10px] opacity-80 hover:opacity-100 transition-opacity px-1"
            >
              {project.section === 'morning' ? 'AM' : 'PM'}
            </button>
            <TimeSelector
              scheduleId={project.scheduleId}
              currentTime={project.time}
              currentSection={project.section}
              onTimeChange={onTimeChange}
              onSectionChange={onSectionChange}
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