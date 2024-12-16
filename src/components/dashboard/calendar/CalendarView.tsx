import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Project, ScheduledProject } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarNavigation } from "../CalendarNavigation";
import { CalendarGrid } from "../CalendarGrid";
import { getDaysToDisplay } from "@/utils/calendarUtils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ProjectFilter } from "./ProjectFilter";
import { useState, useRef } from "react";
import { ExportPDFButton } from "./ExportPDFButton";

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
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceDay = parseInt(source.droppableId);
    const destinationDay = parseInt(destination.droppableId);

    if (sourceDay === destinationDay) return;

    try {
      const projectToMove = scheduledProjects.find(p => p.scheduleId === draggableId);
      if (!projectToMove) return;

      const newDate = new Date(projectToMove.date);
      newDate.setDate(destinationDay);

      const { error } = await supabase
        .from('scheduled_projects')
        .update({ schedule_date: newDate.toISOString() })
        .eq('id', draggableId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <CardTitle>Calendrier</CardTitle>
          <ExportPDFButton 
            calendarRef={calendarRef} 
            viewMode={viewMode} 
            scheduledProjects={scheduledProjects}
            currentDate={currentDate}
          />
        </div>
        <CalendarNavigation
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrevPeriod={() => {
            const newDate = new Date(currentDate);
            if (viewMode === "month") {
              newDate.setMonth(currentDate.getMonth() - 1);
            } else {
              const days = viewMode === "week" ? 7 : 14;
              newDate.setDate(currentDate.getDate() - days);
            }
            setCurrentDate(newDate);
          }}
          onNextPeriod={() => {
            const newDate = new Date(currentDate);
            if (viewMode === "month") {
              newDate.setMonth(currentDate.getMonth() + 1);
            } else {
              const days = viewMode === "week" ? 7 : 14;
              newDate.setDate(currentDate.getDate() + days);
            }
            setCurrentDate(newDate);
          }}
        />
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-2' : 'px-6'}`}>
        <ProjectFilter
          projects={projects}
          selectedProjects={selectedProjects}
          onToggleProject={handleToggleProject}
        />
        <div ref={calendarRef}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <CalendarGrid
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
          </DragDropContext>
        </div>
      </CardContent>
    </Card>
  );
}