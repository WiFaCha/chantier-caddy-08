import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Project } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/utils/supabaseUtils";
import { 
  toggleProjectComplete,
  updateProjectTime,
  updateProjectSection,
  addProjectToCalendar
} from "@/utils/calendarOperations";

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "twoWeeks">("month");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return (data || []).map(project => ({
        ...project,
        color: project.color as "violet" | "blue" | "green" | "red",
        type: project.type as "Mensuel" | "Ponctuel"
      }));
    },
  });

  const { data: scheduledProjects = [], refetch: refetchScheduledProjects } = useQuery({
    queryKey: ['scheduledProjects'],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('scheduled_projects')
        .select(`
          *,
          project:projects(*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
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
    staleTime: 0, // Always consider data as stale
    gcTime: 0, // Don't cache the data (replaces deprecated cacheTime)
  });

  // Listen to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('scheduled_projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_projects'
        },
        () => {
          refetchScheduledProjects();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [refetchScheduledProjects]);

  const handleAddProject = async (day: number, project: Project) => {
    try {
      const scheduleDate = new Date(Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ));
      
      await addProjectToCalendar(project, scheduleDate, project.time, project.section);
      await refetchScheduledProjects();
      
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
      const user = await getCurrentUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('scheduled_projects')
        .delete()
        .eq('id', scheduleId)
        .eq('user_id', user.id);

      if (error) throw error;

      await refetchScheduledProjects();
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
      await toggleProjectComplete(scheduleId, !!currentProject?.completed);
      await refetchScheduledProjects();
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
      await updateProjectTime(scheduleId, time);
      const hour = parseInt(time.split(':')[0]);
      const section = hour >= 12 ? 'afternoon' : 'morning';
      await updateProjectSection(scheduleId, section);
      await refetchScheduledProjects();
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
      await updateProjectSection(scheduleId, section);
      await refetchScheduledProjects();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    projects,
    scheduledProjects,
    handleAddProject,
    handleDeleteProject,
    handleToggleComplete,
    handleTimeChange,
    handleSectionChange
  };
}