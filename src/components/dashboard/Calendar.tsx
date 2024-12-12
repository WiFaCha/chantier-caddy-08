import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CalendarNavigation } from "./CalendarNavigation";
import { Project, ScheduledProject } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarGrid } from "./CalendarGrid";
import { getDaysToDisplay } from "@/utils/calendarUtils";
import { useQueryClient } from "@tanstack/react-query";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "twoWeeks">("week");
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const storedProjects = localStorage.getItem('projects');
      return storedProjects ? JSON.parse(storedProjects) : [];
    },
  });

  const { data: scheduledProjects = [], refetch } = useQuery({
    queryKey: ['scheduledProjects'],
    queryFn: async () => {
      const storedSchedule = localStorage.getItem('scheduledProjects');
      return storedSchedule ? JSON.parse(storedSchedule).map((project: any) => ({
        ...project,
        date: new Date(project.date)
      })) : [];
    },
  });

  const isMobile = useIsMobile();

  const updateScheduledProjects = (newScheduledProjects: ScheduledProject[]) => {
    localStorage.setItem('scheduledProjects', JSON.stringify(newScheduledProjects));
    queryClient.setQueryData(['scheduledProjects'], newScheduledProjects);
  };

  const handleAddProject = (day: number, project: Project) => {
    const scheduleDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const newScheduledProject: ScheduledProject = {
      ...project,
      scheduleId: `${project.id}-${Date.now()}`,
      date: scheduleDate,
      completed: false
    };
    const newScheduledProjects = [...scheduledProjects, newScheduledProject];
    updateScheduledProjects(newScheduledProjects);
  };

  const handleDeleteProject = (scheduleId: string) => {
    const newScheduledProjects = scheduledProjects.filter(project => project.scheduleId !== scheduleId);
    updateScheduledProjects(newScheduledProjects);
  };

  const handleToggleComplete = (scheduleId: string) => {
    const newScheduledProjects = scheduledProjects.map(project => {
      if (project.scheduleId === scheduleId) {
        return { ...project, completed: !project.completed };
      }
      return project;
    });
    updateScheduledProjects(newScheduledProjects);
  };

  const handleTimeChange = (scheduleId: string, time: string) => {
    const newScheduledProjects = scheduledProjects.map(project => {
      if (project.scheduleId === scheduleId) {
        return { ...project, time };
      }
      return project;
    });
    updateScheduledProjects(newScheduledProjects);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceDay = parseInt(source.droppableId);
    const destinationDay = parseInt(destination.droppableId);

    if (sourceDay === destinationDay) return;

    const projectToMove = scheduledProjects.find(p => p.scheduleId === draggableId);
    if (!projectToMove) return;

    const newDate = new Date(projectToMove.date);
    newDate.setDate(destinationDay);

    const newScheduledProjects = scheduledProjects.map(project => {
      if (project.scheduleId === draggableId) {
        return { ...project, date: newDate };
      }
      return project;
    });
    updateScheduledProjects(newScheduledProjects);
  };

  const days = getDaysToDisplay(currentDate, viewMode, isMobile);

  return (
    <Card className="col-span-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-4">
        <CardTitle>Calendrier</CardTitle>
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <CalendarGrid
            days={days}
            projects={projects}
            scheduledProjects={scheduledProjects}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onToggleComplete={handleToggleComplete}
            onTimeChange={handleTimeChange}
            isMobile={isMobile}
          />
        </DragDropContext>
      </CardContent>
    </Card>
  );
}
