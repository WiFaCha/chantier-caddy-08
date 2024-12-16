import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Project, ScheduledProject } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { getDaysToDisplay } from "@/utils/calendarUtils";
import { ProjectFilter } from "./ProjectFilter";
import { useState, useRef } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarContent } from "./CalendarContent";

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  viewMode: "month" | "week" | "twoWeeks";
  setViewMode: (mode: "month" | "week" | "twoWeeks") => void;
  projects: Project[];
  scheduledProjects: ScheduledProject[];
  onAddProject: (day: number, project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
  onSectionChange: (scheduleId: string, section: 'morning' | 'afternoon') => void;
}

export function CalendarView({
  currentDate,
  setCurrentDate,
  viewMode,
  setViewMode,
  projects,
  scheduledProjects,
  onAddProject,
  onDeleteProject,
  onToggleComplete,
  onTimeChange,
  onSectionChange
}: CalendarViewProps) {
  const isMobile = useIsMobile();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const filteredScheduledProjects = selectedProjects.length > 0
    ? scheduledProjects.filter(sp => selectedProjects.includes(sp.id))
    : scheduledProjects;

  const days = getDaysToDisplay(currentDate, viewMode, isMobile);

  const filteredDays = selectedProjects.length > 0
    ? days.filter(day => {
        if (!day) return false;
        return filteredScheduledProjects.some(sp => {
          const spDate = new Date(sp.date);
          return spDate.getDate() === day.getDate() &&
                 spDate.getMonth() === day.getMonth() &&
                 spDate.getFullYear() === day.getFullYear();
        });
      })
    : days;

  return (
    <Card className="col-span-4 w-full">
      <CardHeader>
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setCurrentDate={setCurrentDate}
        />
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-2' : 'px-6'}`}>
        <ProjectFilter
          projects={projects}
          selectedProjects={selectedProjects}
          onToggleProject={handleToggleProject}
        />
        <div ref={calendarRef}>
          <CalendarContent
            days={filteredDays}
            projects={projects}
            scheduledProjects={filteredScheduledProjects}
            onAddProject={onAddProject}
            onDeleteProject={onDeleteProject}
            onToggleComplete={onToggleComplete}
            onTimeChange={onTimeChange}
            onSectionChange={onSectionChange}
            isMobile={isMobile}
          />
        </div>
      </CardContent>
    </Card>
  );
}