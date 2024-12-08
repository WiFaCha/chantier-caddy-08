import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { Draggable, Droppable } from "react-beautiful-dnd";

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

interface CalendarDayProps {
  day: number;
  month: number;
  year: number;
  projects: ScheduledProject[];
  catalogProjects: Project[];
  onAddProject: (day: number, project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
}

export function CalendarDay({ 
  day, 
  month, 
  year,
  projects, 
  catalogProjects, 
  onAddProject, 
  onDeleteProject 
}: CalendarDayProps) {
  const date = new Date(year, month, day);
  const isToday = new Date().toDateString() === date.toDateString();
  const dayOfWeek = date.toLocaleString('fr-FR', { weekday: 'long' });

  return (
    <Droppable droppableId={String(day)}>
      {(provided) => (
        <Card 
          className={`p-2 ${isToday ? 'border-primary' : ''}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="text-center">
            <div className="text-sm text-gray-500">{dayOfWeek}</div>
            <div className="font-medium">{day}</div>
          </div>
          <div className="mt-2 space-y-1">
            {projects.map((project, index) => (
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
                      onClick={() => onDeleteProject(project.scheduleId)}
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
                  {catalogProjects.map((project) => (
                    <Button
                      key={project.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onAddProject(day, project)}
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
  );
}