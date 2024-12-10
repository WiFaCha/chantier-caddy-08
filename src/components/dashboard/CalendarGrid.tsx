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
  return isMobile ? (
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
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-7 gap-6">
      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
        <div key={day} className="text-center font-medium p-2 text-sm">
          {day}
        </div>
      ))}
      {days.map((date, index) => (
        <div key={index} className="min-h-[200px]">
          {date !== null ? (
            <CalendarDay
              day={date.getDate()}
              month={date.getMonth()}
              year={date.getFullYear()}
              projects={getProjectsForDay(scheduledProjects, date.getDate(), date.getMonth(), date.getFullYear())}
              catalogProjects={projects}
              onAddProject={onAddProject}
              onDeleteProject={onDeleteProject}
              onToggleComplete={onToggleComplete}
              onTimeChange={onTimeChange}
            />
          ) : (
            <div className="h-full" />
          )}
        </div>
      ))}
    </div>
  );
}