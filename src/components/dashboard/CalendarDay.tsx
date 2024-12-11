import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Droppable } from "react-beautiful-dnd";
import { useState } from "react";
import { Project, ScheduledProject } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { DayHeader } from "./calendar/DayHeader";
import { ProjectItem } from "./calendar/ProjectItem";

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
  onTimeChange
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
          className={`h-full w-full p-4 ${isToday ? 'border-primary border-2' : ''}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="flex flex-col h-full">
            <DayHeader date={date} isMobile={isMobile} />
            <div className="space-y-2 flex-1 overflow-y-auto">
              {projects.map((project, index) => (
                <ProjectItem
                  key={project.scheduleId}
                  project={project}
                  index={index}
                  isMobile={isMobile}
                  onToggleComplete={onToggleComplete}
                  onDeleteProject={onDeleteProject}
                  onTimeChange={onTimeChange}
                />
              ))}
              {provided.placeholder}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left text-sm p-2 mt-2"
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