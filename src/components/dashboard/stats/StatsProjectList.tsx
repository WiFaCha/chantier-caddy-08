import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock } from "lucide-react";
import { ScheduledProject } from "@/types/calendar";

interface StatsProjectListProps {
  title: string;
  projects: ScheduledProject[];
  onToggleComplete: (scheduleId: string) => void;
  onAddressClick: (address: string) => void;
}

export function StatsProjectList({
  title,
  projects,
  onToggleComplete,
  onAddressClick
}: StatsProjectListProps) {
  const isWindowCleaningMonth = (project: ScheduledProject) => {
    if (!project?.window_cleaning) return false;
    const currentMonth = (project.date.getMonth() + 1).toString();
    return project.window_cleaning.includes(currentMonth);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {projects.map((project: ScheduledProject) => (
        <div
          key={project.scheduleId}
          className={`rounded p-3 flex items-center gap-3 ${
            project.color === "violet"
              ? "bg-violet-100 text-violet-900"
              : project.color === "blue"
              ? "bg-blue-100 text-blue-900"
              : project.color === "green"
              ? "bg-green-100 text-green-900"
              : "bg-red-100 text-red-900"
          }`}
        >
          <Checkbox
            checked={project.completed}
            onCheckedChange={() => onToggleComplete(project.scheduleId)}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
          <div className="flex-1">
            <div className="font-medium">{project.title}</div>
            {project.address && (
              <button 
                onClick={() => onAddressClick(project.address)}
                className="flex items-center text-sm hover:underline"
              >
                <MapPin className="mr-1 h-4 w-4" />
                Itinéraire
              </button>
            )}
            <div className="flex items-center gap-2 mt-1">
              {project.time && (
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4" />
                  {project.time}
                </div>
              )}
              {isWindowCleaningMonth(project) && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                  Vitres
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}