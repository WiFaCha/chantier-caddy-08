import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Project, ScheduledProject } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarNavigation } from "../CalendarNavigation";
import { CalendarGrid } from "../CalendarGrid";
import { getDaysToDisplay } from "@/utils/calendarUtils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  viewMode: "month" | "week" | "twoWeeks";
  setViewMode: (mode: "month" | "week" | "twoWeeks") => void;
  projects: Project[];
  scheduledProjects: ScheduledProject[];
  onAddProject: (day: number, project: Project) => void;
  onDeleteProject: (scheduleId: string) => void;
  onToggleComplete: (scheduleId: string) => void;
  onTimeChange: (scheduleId: string, time: string) => void;
}

export function CalendarView({
  currentDate,
  setCurrentDate,
  viewMode,
  setViewMode,
  projects,
  scheduledProjects,
  onAddProject,
  onDeleteProject,
  onToggleComplete,
  onTimeChange
}: CalendarViewProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const days = getDaysToDisplay(currentDate, viewMode, isMobile);

  return (
    <Card className="col-span-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-4">
        <CardTitle>Calendrier</CardTitle>
        <CalendarNavigation
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrevPeriod={() => {
            const newDate = new Date(currentDate);
            if (viewMode === "month") {
              newDate.setMonth(currentDate.getMonth() - 1);
            } else {
              const days = viewMode === "week" ? 7 : 14;
              newDate.setDate(currentDate.getDate() - days);
            }
            setCurrentDate(newDate);
          }}
          onNextPeriod={() => {
            const newDate = new Date(currentDate);
            if (viewMode === "month") {
              newDate.setMonth(currentDate.getMonth() + 1);
            } else {
              const days = viewMode === "week" ? 7 : 14;
              newDate.setDate(currentDate.getDate() + days);
            }
            setCurrentDate(newDate);
          }}
        />
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-2' : 'px-6'}`}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <CalendarGrid
            days={days}
            projects={projects}
            scheduledProjects={scheduledProjects}
            onAddProject={onAddProject}
            onDeleteProject={onDeleteProject}
            onToggleComplete={onToggleComplete}
            onTimeChange={onTimeChange}
            isMobile={isMobile}
          />
        </DragDropContext>
      </CardContent>
    </Card>
  );
}