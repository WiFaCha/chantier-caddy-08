import { Card } from "@/components/ui/card";
import { Project, ScheduledProject } from "@/types/calendar";
import { DayHeader } from "./calendar/DayHeader";
import { DayContent } from "./calendar/DayContent";

interface CalendarDayProps {
  day: number;
  month: number;
  year: number;
  projects: ScheduledProject[];
  catalogProjects: Project[];
  onAddProject: (day: number, month: number, year: number, project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
  onSectionChange: (scheduleId: string, section: 'morning' | 'afternoon') => void;
  isMobile: boolean;
}

export function CalendarDay({
  day,
  month,
  year,
  projects,
  catalogProjects,
  onAddProject,
  onDeleteProject,
  onToggleComplete,
  onTimeChange,
  onSectionChange,
  isMobile
}: CalendarDayProps) {
  const date = new Date(year, month, day);
  const isToday = new Date().toDateString() === date.toDateString();

  const sortedProjects = [...projects].sort((a, b) => {
    if (!a.time && !b.time) return 0;
    if (!a.time) return -1;
    if (!b.time) return 1;
    return a.time.localeCompare(b.time);
  });

  const morningProjects = sortedProjects.filter(p => {
    if (p.section === 'morning') return true;
    if (p.section === 'afternoon') return false;
    if (!p.section && !p.time) return true;
    if (!p.time) return true;
    const time = parseInt(p.time.split(':')[0]);
    return time < 12;
  });

  const afternoonProjects = sortedProjects.filter(p => {
    if (p.section === 'afternoon') return true;
    if (p.section === 'morning') return false;
    if (!p.time) return false;
    const time = parseInt(p.time.split(':')[0]);
    return time >= 12;
  });

  const handleAddProject = (period: 'morning' | 'afternoon') => (project: Project) => {
    const projectWithTime = { 
      ...project, 
      section: period,
      time: undefined      
    };
    onAddProject(day, month, year, projectWithTime);
  };

  return (
    <Card className={`h-full w-full p-4 ${isToday ? 'border-primary border-2' : ''}`}>
      <div className="flex flex-col h-full">
        <DayHeader date={date} isMobile={isMobile} />
        <DayContent
          morningProjects={morningProjects}
          afternoonProjects={afternoonProjects}
          catalogProjects={catalogProjects}
          isMobile={isMobile}
          onAddProject={handleAddProject}
          onDeleteProject={onDeleteProject}
          onToggleComplete={onToggleComplete}
          onTimeChange={onTimeChange}
          onSectionChange={onSectionChange}
          day={day}
        />
      </div>
    </Card>
  );
}