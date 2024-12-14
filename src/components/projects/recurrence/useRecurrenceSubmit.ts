import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { RecurrenceFormValues } from "./types";

export function useRecurrenceSubmit(project: Project, onSuccess: () => void) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (data: RecurrenceFormValues) => {
    try {
      const startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      
      const endDate = new Date(data.endDate);
      endDate.setUTCHours(23, 59, 59, 999);
      
      const weekdays = data.weekdays;
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        if (weekdays.includes(currentDate.getDay())) {
          const scheduleDate = new Date(Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ));
          
          const { error } = await supabase
            .from('scheduled_projects')
            .insert({
              project_id: project.id,
              schedule_date: scheduleDate.toISOString().split('T')[0],
              user_id: (await supabase.auth.getUser()).data.user?.id
            });
          
          if (error) throw error;
        }
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
      
      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
      toast({
        title: "Succès",
        description: "Les chantiers ont été planifiés avec succès",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return handleSubmit;
}