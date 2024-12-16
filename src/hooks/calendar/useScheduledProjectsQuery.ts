import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/utils/supabaseUtils";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useScheduledProjectsQuery() {
  const queryClient = useQueryClient();

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
    staleTime: 0,
    gcTime: 0,
  });

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

  return {
    scheduledProjects,
    refetchScheduledProjects
  };
}