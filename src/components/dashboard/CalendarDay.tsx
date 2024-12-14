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
  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon'>('morning');
  const isMobile = useIsMobile();
  const date = new Date(year, month, day);
  const isToday = new Date().toDateString() === date.toDateString();

  const handleAddProject = (project: Project) => {
    const defaultTime = selectedPeriod === 'morning' ? '09:00' : '14:00';
    onAddProject(day, { ...project, time: defaultTime });
    setIsDialogOpen(false);
  };

  const morningProjects = projects.filter(p => {
    const time = p.time ? parseInt(p.time.split(':')[0]) : 0;
    return time < 12;
  });

  const afternoonProjects = projects.filter(p => {
    const time = p.time ? parseInt(p.time.split(':')[0]) : 0;
    return time >= 12;
  });

  return (
    <Card 
      className={`h-full w-full p-4 ${isToday ? 'border-primary border-2' : ''}`}
    >
      <div className="flex flex-col h-full">
        <DayHeader date={date} isMobile={isMobile} />
        <div className="space-y-2 flex-1 overflow-y-auto">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground mb-2">Matin</div>
              <Dialog open={isDialogOpen && selectedPeriod === 'morning'} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (open) setSelectedPeriod('morning');
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-6 px-2 text-xs"
                  >
                    +
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Ajouter un chantier (Matin)</DialogTitle>
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
            <Droppable droppableId={`${day}-morning`}>
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {morningProjects.map((project, index) => (
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
            <div className="my-3 border-t border-border" />
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground mb-2">Après-midi</div>
              <Dialog open={isDialogOpen && selectedPeriod === 'afternoon'} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (open) setSelectedPeriod('afternoon');
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-6 px-2 text-xs"
                  >
                    +
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Ajouter un chantier (Après-midi)</DialogTitle>
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
            <Droppable droppableId={`${day}-afternoon`}>
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {afternoonProjects.map((project, index) => (
                    <ProjectItem
                      key={project.scheduleId}
                      project={project}
                      index={index + morningProjects.length}
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
        </div>
      </div>
    </Card>
  );
}