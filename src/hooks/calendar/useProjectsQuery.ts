import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', DEFAULT_USER_ID);
      
      if (error) throw error;
      
      return (data || []).map(project => ({
        ...project,
        color: project.color as "violet" | "blue" | "green" | "red",
        type: project.type as "Mensuel" | "Ponctuel"
      }));
    },
  });
}