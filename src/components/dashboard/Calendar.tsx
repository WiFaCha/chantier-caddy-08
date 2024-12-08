import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";

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

  // Fetch projects from the catalog
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      // Simulated API call - replace with actual API call
      return new Promise((resolve) => {
        const storedProjects = localStorage.getItem('projects');
        resolve(storedProjects ? JSON.parse(storedProjects) : []);
      });
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

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Calendrier</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <Droppable key={i} droppableId={String(i + 1)}>
                {(provided) => (
                  <Card 
                    className="p-2"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="text-center">{i + 1}</div>
                    <div className="mt-2 space-y-1">
                      {getProjectsForDay(i + 1).map((project, index) => (
                        <Draggable
                          key={project.scheduleId}
                          draggableId={project.scheduleId}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between rounded p-1 text-sm text-white ${
                                project.color === "violet"
                                  ? "bg-violet-500"
                                  : project.color === "blue"
                                  ? "bg-blue-500"
                                  : project.color === "green"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              <span>{project.title}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 text-white hover:text-white/80"
                                onClick={() => handleDeleteProject(project.scheduleId)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start text-left text-sm">
                            + Ajouter
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ajouter un chantier</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            {projects.map((project) => (
                              <Button
                                key={project.id}
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => handleAddProject(i + 1, project)}
                              >
                                {project.title}
                              </Button>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}