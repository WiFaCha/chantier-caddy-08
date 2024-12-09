import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDay } from "./CalendarDay";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [viewMode, setViewMode] = useState<"month" | "week" | "twoWeeks">("month");

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

  // Get the days to display based on view mode
  const getDaysToDisplay = () => {
    const result = [];
    let startDate = new Date(currentDate);

    if (viewMode === "month") {
      // Reset to first day of month
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
      const firstDayOfMonth = startDate.getDay();
      // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
      const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
      // Add empty days at the start
      for (let i = 0; i < adjustedFirstDay; i++) {
        result.push(null);
      }
      // Add all days of the month
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        result.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
      }
    } else {
      // For week and two-week views
      // Start from Monday of the current week
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(startDate.setDate(diff));

      // Add days based on view mode
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
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Calendrier</CardTitle>
        <div className="flex items-center gap-4">
          <Select
            value={viewMode}
            onValueChange={(value: "month" | "week" | "twoWeeks") => setViewMode(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner la vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="twoWeeks">Deux semaines</SelectItem>
            </SelectContent>
          </Select>
          <CalendarHeader
            currentDate={currentDate}
            onPrevPeriod={handlePrevPeriod}
            onNextPeriod={handleNextPeriod}
            viewMode={viewMode}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-7 gap-4">
            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
            {days.map((date, index) => (
              <div key={index}>
                {date !== null ? (
                  <CalendarDay
                    day={date.getDate()}
                    month={date.getMonth()}
                    year={date.getFullYear()}
                    projects={getProjectsForDay(date.getDate())}
                    catalogProjects={projects}
                    onAddProject={handleAddProject}
                    onDeleteProject={handleDeleteProject}
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
