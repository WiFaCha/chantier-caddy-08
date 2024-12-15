import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Project, ScheduledProject } from "@/types/calendar";
import { DayHeader } from "./calendar/DayHeader";
import { DaySection } from "./calendar/DaySection";

interface CalendarDayProps {
  day: number;
  month: number;
  year: number;
  projects: ScheduledProject[];
  catalogProjects: Project[];
  onAddProject: (day: number, project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
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
  isMobile
}: CalendarDayProps) {
  const date = new Date(year, month, day);
  const isToday = new Date().toDateString() === date.toDateString();

  const sortedProjects = [...projects].sort((a, b) => {
    if (!a.time && !b.time) return 0;
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  const morningProjects = sortedProjects.filter(p => {
    const time = p.time ? parseInt(p.time.split(':')[0]) : 0;
    return time < 12;
  });

  const afternoonProjects = sortedProjects.filter(p => {
    const time = p.time ? parseInt(p.time.split(':')[0]) : 0;
    return time >= 12;
  });

  const handleAddProject = (period: 'morning' | 'afternoon') => (project: Project) => {
    const defaultTime = period === 'morning' ? '09:00' : '14:00';
    onAddProject(day, { ...project, time: defaultTime });
  };

  return (
    <Card className={`h-full w-full p-4 ${isToday ? 'border-primary border-2' : ''}`}>
      <div className="flex flex-col h-full">
        <DayHeader date={date} isMobile={isMobile} />
        <div className="space-y-2 flex-1 overflow-y-auto">
          <div className="relative">
            <DaySection
              title="Matin"
              droppableId={`${day}-morning`}
              projects={morningProjects}
              catalogProjects={catalogProjects}
              isMobile={isMobile}
              onAddProject={handleAddProject('morning')}
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
              onAddProject={handleAddProject('afternoon')}
              onDeleteProject={onDeleteProject}
              onToggleComplete={onToggleComplete}
              onTimeChange={onTimeChange}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}