import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Project, ScheduledProject } from "@/types/calendar";
import { Droppable } from "react-beautiful-dnd";
import { ProjectItem } from "./ProjectItem";

interface DaySectionProps {
  title: string;
  droppableId: string;
  projects: ScheduledProject[];
  catalogProjects: Project[];
  isMobile: boolean;
  onAddProject: (project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
}

export function DaySection({
  title,
  droppableId,
  projects,
  catalogProjects,
  isMobile,
  onAddProject,
  onDeleteProject,
  onToggleComplete,
  onTimeChange
}: DaySectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground mb-2">{title}</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-6 px-2 text-xs">+</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Ajouter un chantier ({title})</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {catalogProjects.map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onAddProject(project)}
                >
                  {project.title}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 min-h-[50px] p-2 ${snapshot.isDraggingOver ? 'bg-muted/50 rounded-lg' : ''}`}
          >
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
        )}
      </Droppable>
    </div>
  );
}