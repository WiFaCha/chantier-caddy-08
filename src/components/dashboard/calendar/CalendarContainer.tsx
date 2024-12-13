import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarView } from "./CalendarView";
import { Project, ScheduledProject } from "@/types/calendar";

export function CalendarContainer() {
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
      
      return (data || []).map(project => ({
        ...project,
        color: project.color as "violet" | "blue" | "green" | "red",
        type: project.type as "Mensuel" | "Ponctuel"
      }));
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
        color: sp.project.color as "violet" | "blue" | "green" | "red",
        type: sp.project.type as "Mensuel" | "Ponctuel",
        scheduleId: sp.id,
        date: new Date(sp.schedule_date),
        completed: sp.completed,
        time: sp.time
      })) || [];
    },
  });

  const handleAddProject = async (day: number, project: Project) => {
    try {
      const scheduleDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      const { error } = await supabase
        .from('scheduled_projects')
        .insert([{
          project_id: project.id,
          schedule_date: scheduleDate.toISOString().split('T')[0],
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

  return (
    <CalendarView
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      viewMode={viewMode}
      setViewMode={setViewMode}
      projects={projects}
      scheduledProjects={scheduledProjects}
      onAddProject={handleAddProject}
      onDeleteProject={handleDeleteProject}
      onToggleComplete={handleToggleComplete}
      onTimeChange={handleTimeChange}
    />
  );
}