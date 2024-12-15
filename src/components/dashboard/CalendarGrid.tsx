import { CalendarDay } from "./CalendarDay";
import { Project, ScheduledProject } from "@/types/calendar";
import { getProjectsForDay } from "@/utils/calendarUtils";

interface CalendarGridProps {
  days: (Date | null)[];
  projects: Project[];
  scheduledProjects: ScheduledProject[];
  onAddProject: (day: number, project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
  isMobile: boolean;
}

export function CalendarGrid({
  days,
  projects,
  scheduledProjects,
  onAddProject,
  onDeleteProject,
  onToggleComplete,
  onTimeChange,
  isMobile
}: CalendarGridProps) {
  if (isMobile) {
    return (
      <div className="space-y-4">
        {days.filter(date => date !== null).map((date, index) => (
          <div key={index} className="w-full">
            <CalendarDay
              day={date!.getDate()}
              month={date!.getMonth()}
              year={date!.getFullYear()}
              projects={getProjectsForDay(scheduledProjects, date!.getDate(), date!.getMonth(), date!.getFullYear())}
              catalogProjects={projects}
              onAddProject={onAddProject}
              onDeleteProject={onDeleteProject}
              onToggleComplete={onToggleComplete}
              onTimeChange={onTimeChange}
              isMobile={isMobile}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {days.filter(date => date !== null).map((date, index) => (
          <div key={index} className="min-h-[250px]">
            <CalendarDay
              day={date!.getDate()}
              month={date!.getMonth()}
              year={date!.getFullYear()}
              projects={getProjectsForDay(scheduledProjects, date!.getDate(), date!.getMonth(), date!.getFullYear())}
              catalogProjects={projects}
              onAddProject={onAddProject}
              onDeleteProject={onDeleteProject}
              onToggleComplete={onToggleComplete}
              onTimeChange={onTimeChange}
              isMobile={isMobile}
            />
          </div>
        ))}
      </div>
    </div>
  );
}