import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDay } from "./CalendarDay";

interface Project {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "Mensuel" | "Ponctuel";
  details?: string;
  color: "violet" | "blue" | "green" | "red";
}

interface ScheduledProject extends Project {
  scheduleId: string;
  date: Date;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledProjects, setScheduledProjects] = useState<ScheduledProject[]>([]);

  // Fetch projects from the catalog using localStorage
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const storedProjects = localStorage.getItem('projects');
      return storedProjects ? JSON.parse(storedProjects) : [];
    },
  });

  // Load scheduled projects from localStorage
  useEffect(() => {
    const storedSchedule = localStorage.getItem('scheduledProjects');
    if (storedSchedule) {
      setScheduledProjects(JSON.parse(storedSchedule).map((project: any) => ({
        ...project,
        date: new Date(project.date)
      })));
    }
  }, []);

  // Save scheduled projects to localStorage
  useEffect(() => {
    localStorage.setItem('scheduledProjects', JSON.stringify(scheduledProjects));
  }, [scheduledProjects]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddProject = (day: number, project: Project) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setScheduledProjects([
      ...scheduledProjects,
      {
        ...project,
        scheduleId: Date.now().toString(),
        date,
      },
    ]);
  };

  const handleDeleteProject = (scheduleId: string) => {
    setScheduledProjects(scheduledProjects.filter((project) => project.scheduleId !== scheduleId));
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

  // Get the number of days in the current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Create array of day numbers for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Add empty days at the start to align with correct day of week
  const emptyDays = Array(adjustedFirstDay).fill(null);
  const allDays = [...emptyDays, ...days];

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Calendrier</CardTitle>
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-7 gap-4">
            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
            {allDays.map((day, index) => (
              <div key={index}>
                {day !== null ? (
                  <CalendarDay
                    day={day}
                    month={currentDate.getMonth()}
                    year={currentDate.getFullYear()}
                    projects={getProjectsForDay(day)}
                    catalogProjects={projects}
                    onAddProject={handleAddProject}
                    onDeleteProject={handleDeleteProject}
                  />
                ) : (
                  <div className="h-full" /> // Empty cell for alignment
                )}
              </div>
            ))}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}