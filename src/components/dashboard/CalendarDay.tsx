import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useState } from "react";
import { Project, ScheduledProject } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarDayProps {
  day: number;
  month: number;
  year: number;
  projects: ScheduledProject[];
  catalogProjects: Project[];
  onAddProject: (day: number, project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
}

export function CalendarDay({ 
  day, 
  month, 
  year,
  projects, 
  catalogProjects, 
  onAddProject, 
  onDeleteProject,
  onToggleComplete
}: CalendarDayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const date = new Date(year, month, day);
  const isToday = new Date().toDateString() === date.toDateString();

  const handleAddProject = (project: Project) => {
    onAddProject(day, project);
    setIsDialogOpen(false);
  };

  return (
    <Droppable droppableId={String(day)}>
      {(provided) => (
        <Card 
          className={`h-full w-full p-3 ${isToday ? 'border-primary border-2' : ''}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className={`${isMobile ? 'text-lg font-medium mb-3' : 'text-center mb-2'}`}>
            {isMobile ? (
              format(date, "EEEE d MMMM", { locale: fr })
            ) : (
              <div className="text-base font-medium">{day}</div>
            )}
          </div>
          <div className="space-y-2 max-h-[calc(100%-2rem)] overflow-y-auto">
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
                    className={`flex items-center justify-between rounded p-2 ${isMobile ? 'text-sm' : 'text-xs'} text-white ${
                      project.color === "violet"
                        ? "bg-violet-500"
                        : project.color === "blue"
                        ? "bg-blue-500"
                        : project.color === "green"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Checkbox
                        checked={project.completed}
                        onCheckedChange={() => onToggleComplete(project.scheduleId)}
                        className="h-4 w-4 bg-white/20 border-white/40 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <span className="truncate">{project.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white hover:text-white/80 shrink-0"
                      onClick={() => onDeleteProject(project.scheduleId)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left text-sm p-2"
                >
                  + Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Ajouter un chantier</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {catalogProjects.map((project) => (
                    <Button
                      key={project.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleAddProject(project)}
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