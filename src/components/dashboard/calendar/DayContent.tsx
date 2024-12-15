import { Project, ScheduledProject } from "@/types/calendar";
import { DaySection } from "./DaySection";

interface DayContentProps {
  morningProjects: ScheduledProject[];
  afternoonProjects: ScheduledProject[];
  catalogProjects: Project[];
  isMobile: boolean;
  onAddProject: (period: 'morning' | 'afternoon') => (project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
  day: number;
}

export function DayContent({
  morningProjects,
  afternoonProjects,
  catalogProjects,
  isMobile,
  onAddProject,
  onDeleteProject,
  onToggleComplete,
  onTimeChange,
  day
}: DayContentProps) {
  return (
    <div className="space-y-2 flex-1 overflow-y-auto">
      <div className="relative">
        <DaySection
          title="Matin"
          droppableId={`${day}-morning`}
          projects={morningProjects}
          catalogProjects={catalogProjects}
          isMobile={isMobile}
          onAddProject={onAddProject('morning')}
          onDeleteProject={onDeleteProject}
          onToggleComplete={onToggleComplete}
          onTimeChange={onTimeChange}
        />
        <div className="my-3 border-t border-border" />
        <DaySection
          title="Après-midi"
          droppableId={`${day}-afternoon`}
          projects={afternoonProjects}
          catalogProjects={catalogProjects}
          isMobile={isMobile}
          onAddProject={onAddProject('afternoon')}
          onDeleteProject={onDeleteProject}
          onToggleComplete={onToggleComplete}
          onTimeChange={onTimeChange}
        />
      </div>
    </div>
  );
}