import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Project, ScheduledProject } from "@/types/calendar";
import { CalendarGrid } from "../CalendarGrid";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface CalendarContentProps {
  days: (Date | null)[];
  projects: Project[];
  scheduledProjects: ScheduledProject[];
  onAddProject: (day: number, project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
  onSectionChange: (scheduleId: string, section: 'morning' | 'afternoon') => void;
  isMobile: boolean;
}

export function CalendarContent({
  days,
  projects,
  scheduledProjects,
  onAddProject,
  onDeleteProject,
  onToggleComplete,
  onTimeChange,
  onSectionChange,
  isMobile
}: CalendarContentProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceDay = parseInt(source.droppableId);
    const destinationDay = parseInt(destination.droppableId);

    if (sourceDay === destinationDay) return;

    try {
      const projectToMove = scheduledProjects.find(p => p.scheduleId === draggableId);
      if (!projectToMove) return;

      const newDate = new Date(projectToMove.date);
      newDate.setDate(destinationDay);

      const { error } = await supabase
        .from('scheduled_projects')
        .update({ schedule_date: newDate.toISOString() })
        .eq('id', draggableId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <CalendarGrid
        days={days}
        projects={projects}
        scheduledProjects={scheduledProjects}
        onAddProject={onAddProject}
        onDeleteProject={onDeleteProject}
        onToggleComplete={onToggleComplete}
        onTimeChange={onTimeChange}
        onSectionChange={onSectionChange}
        isMobile={isMobile}
      />
    </DragDropContext>
  );
}