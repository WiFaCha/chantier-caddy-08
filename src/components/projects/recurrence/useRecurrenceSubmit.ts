import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

export function useRecurrenceSubmit(project: Project, onSuccess: () => void) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async ({ numberOfDays }: { numberOfDays: number }) => {
    try {
      const startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      
      const promises = Array.from({ length: numberOfDays }, (_, index) => {
        const scheduleDate = new Date(startDate);
        scheduleDate.setDate(startDate.getDate() + index);
        
        return supabase
          .from('scheduled_projects')
          .insert({
            project_id: project.id,
            schedule_date: scheduleDate.toISOString().split('T')[0],
            user_id: DEFAULT_USER_ID
          });
      });
      
      await Promise.all(promises);
      
      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
      toast({
        title: "Succès",
        description: `Le chantier a été planifié sur ${numberOfDays} jours`,
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