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
  onSectionChange: (scheduleId: string, section: 'morning' | 'afternoon') => void;
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
  onSectionChange,
  day
}: DayContentProps) {
  const formatProjectTitle = (project: ScheduledProject) => {
    let title = project.title;
    if (project.window_cleaning && project.window_cleaning.length > 0) {
      title = `${title} • Vitres`;
    }
    if (project.time) {
      title = `${title} (${project.time})`;
    }
    return title;
  };

  return (
    <div className="space-y-2 flex-1 overflow-y-auto">
      <div className="relative">
        <DaySection
          title="Matin"
          droppableId={`${day}-morning`}
          projects={morningProjects.map(project => ({
            ...project,
            title: formatProjectTitle(project)
          }))}
          catalogProjects={catalogProjects}
          isMobile={isMobile}
          onAddProject={onAddProject('morning')}
          onDeleteProject={onDeleteProject}
          onToggleComplete={onToggleComplete}
          onTimeChange={onTimeChange}
          onSectionChange={onSectionChange}
        />
        <div className="my-3 border-t border-border" />
        <DaySection
          title="Après-midi"
          droppableId={`${day}-afternoon`}
          projects={afternoonProjects.map(project => ({
            ...project,
            title: formatProjectTitle(project)
          }))}
          catalogProjects={catalogProjects}
          isMobile={isMobile}
          onAddProject={onAddProject('afternoon')}
          onDeleteProject={onDeleteProject}
          onToggleComplete={onToggleComplete}
          onTimeChange={onTimeChange}
          onSectionChange={onSectionChange}
        />
      </div>
    </div>
  );
}