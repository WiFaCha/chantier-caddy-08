import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CalendarNavigation } from "./CalendarNavigation";
import { Project, ScheduledProject } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarGrid } from "./CalendarGrid";
import { getDaysToDisplay } from "@/utils/calendarUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "twoWeeks">("week");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: scheduledProjects = [] } = useQuery({
    queryKey: ['scheduledProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_projects')
        .select(`
          *,
          project:projects(*)
        `);
      
      if (error) throw error;
      
      return data.map((sp: any) => ({
        ...sp.project,
        scheduleId: sp.id,
        date: new Date(sp.schedule_date),
        completed: sp.completed,
        time: sp.time
      })) || [];
    },
  });

  const isMobile = useIsMobile();

  const handleAddProject = async (day: number, project: Project) => {
    try {
      const scheduleDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const { error } = await supabase
        .from('scheduled_projects')
        .insert([{
          project_id: project.id,
          schedule_date: scheduleDate.toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
      toast({
        title: "Succès",
        description: "Le chantier a été planifié avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_projects')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
      toast({
        title: "Succès",
        description: "Le chantier a été supprimé du calendrier",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (scheduleId: string) => {
    try {
      const currentProject = scheduledProjects.find(p => p.scheduleId === scheduleId);
      const { error } = await supabase
        .from('scheduled_projects')
        .update({ 
          completed: !currentProject?.completed,
          user_id: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('id', scheduleId);

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

  const handleTimeChange = async (scheduleId: string, time: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_projects')
        .update({ 
          time: time,
          user_id: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('id', scheduleId);

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

  // Set up real-time subscription
  useEffect(() => {
    const scheduledProjectsSubscription = supabase
      .channel('scheduled_projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_projects'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
        }
      )
      .subscribe();

    return () => {
      scheduledProjectsSubscription.unsubscribe();
    };
  }, [queryClient]);

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
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onToggleComplete={handleToggleComplete}
            onTimeChange={handleTimeChange}
            isMobile={isMobile}
          />
        </DragDropContext>
      </CardContent>
    </Card>
  );
}
