import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";

export function useProjectsQuery() {
  return useQuery({
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
}