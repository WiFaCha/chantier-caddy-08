import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarView } from "./CalendarView";
import { Project } from "@/types/calendar";

export function CalendarContainer() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "twoWeeks">("month");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        return [];
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }
      
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        return [];
      }

      const { data, error } = await supabase
        .from('scheduled_projects')
        .select(`
          *,
          project:projects(*)
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching scheduled projects:", error);
        throw error;
      }
      
      return (data || []).map((sp: any) => {
        const date = new Date(sp.schedule_date);
        date.setUTCHours(0, 0, 0, 0);
        
        return {
          ...sp.project,
          color: sp.project.color as "violet" | "blue" | "green" | "red",
          type: sp.project.type as "Mensuel" | "Ponctuel",
          scheduleId: sp.id,
          date: date,
          completed: sp.completed,
          time: sp.time,
          section: sp.section
        };
      });
    },
  });

  const handleAddProject = async (day: number, project: Project) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter un projet",
          variant: "destructive",
        });
        return;
      }

      const scheduleDate = new Date(Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ));
      
      const { error } = await supabase
        .from('scheduled_projects')
        .insert([{
          project_id: project.id,
          schedule_date: scheduleDate.toISOString().split('T')[0],
          user_id: user.id,
          time: project.time,
          section: project.section
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
          user_id: user.id
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
          user_id: user.id
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

  const handleSectionChange = async (scheduleId: string, section: 'morning' | 'afternoon') => {
    try {
      const { error } = await supabase
        .from('scheduled_projects')
        .update({ 
          section: section,
          user_id: user.id
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
      onSectionChange={handleSectionChange}
    />
  );
}
