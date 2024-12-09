import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CalendarDay } from "./CalendarDay";
import { CalendarNavigation } from "./CalendarNavigation";
import { Project, ScheduledProject } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledProjects, setScheduledProjects] = useState<ScheduledProject[]>([]);
  const [viewMode, setViewMode] = useState<"month" | "week" | "twoWeeks">("month");

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const storedProjects = localStorage.getItem('projects');
      return storedProjects ? JSON.parse(storedProjects) : [];
    },
  });

  const isMobile = useIsMobile();

  useEffect(() => {
    const storedSchedule = localStorage.getItem('scheduledProjects');
    if (storedSchedule) {
      setScheduledProjects(JSON.parse(storedSchedule).map((project: any) => ({
        ...project,
        date: new Date(project.date)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scheduledProjects', JSON.stringify(scheduledProjects));
  }, [scheduledProjects]);

  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      const days = viewMode === "week" ? 7 : 14;
      newDate.setDate(currentDate.getDate() - days);
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      const days = viewMode === "week" ? 7 : 14;
      newDate.setDate(currentDate.getDate() + days);
    }
    setCurrentDate(newDate);
  };

  const handleAddProject = (day: number, project: Project) => {
    const scheduleDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const newScheduledProject: ScheduledProject = {
      ...project,
      scheduleId: `${project.id}-${Date.now()}`,
      date: scheduleDate,
      completed: false
    };
    setScheduledProjects([...scheduledProjects, newScheduledProject]);
  };

  const handleDeleteProject = (scheduleId: string) => {
    setScheduledProjects(scheduledProjects.filter(project => project.scheduleId !== scheduleId));
  };

  const handleToggleComplete = (scheduleId: string) => {
    setScheduledProjects(scheduledProjects.map(project => {
      if (project.scheduleId === scheduleId) {
        return { ...project, completed: !project.completed };
      }
      return project;
    }));
  };

  const getDaysToDisplay = () => {
    const result = [];
    let startDate = new Date(currentDate);

    if (viewMode === "month") {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayOfMonth = startDate.getDay();
      const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
      for (let i = 0; i < adjustedFirstDay; i++) {
        result.push(null);
      }
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        result.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
      }
    } else {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(startDate.setDate(diff));
      const daysToShow = viewMode === "week" ? 7 : 14;
      for (let i = 0; i < daysToShow; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        result.push(currentDay);
      }
    }

    return result;
  };

  const getProjectsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return scheduledProjects.filter(
      (project) => project.date.toDateString() === date.toDateString()
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceDay = parseInt(result.source.droppableId);
    const destinationDay = parseInt(result.destination.droppableId);
    const projectId = result.draggableId;

    setScheduledProjects(scheduledProjects.map(project => {
      if (project.scheduleId === projectId) {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), destinationDay);
        return { ...project, date: newDate };
      }
      return project;
    }));
  };

  const days = getDaysToDisplay();

  return (
    <Card className="col-span-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-4">
        <CardTitle>Calendrier</CardTitle>
        <CalendarNavigation
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrevPeriod={handlePrevPeriod}
          onNextPeriod={handleNextPeriod}
        />
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-1' : 'px-6'}`}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={`grid grid-cols-7 gap-1 md:gap-4 ${isMobile ? 'min-w-0' : 'min-w-[800px]'}`}>
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div key={day} className="text-center font-medium text-xs md:text-base">
                {day}
              </div>
            ))}
            {days.map((date, index) => (
              <div key={index} className="w-full">
                {date !== null ? (
                  <CalendarDay
                    day={date.getDate()}
                    month={date.getMonth()}
                    year={date.getFullYear()}
                    projects={getProjectsForDay(date.getDate())}
                    catalogProjects={projects}
                    onAddProject={handleAddProject}
                    onDeleteProject={handleDeleteProject}
                    onToggleComplete={handleToggleComplete}
                  />
                ) : (
                  <div className="h-full" />
                )}
              </div>
            ))}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}
