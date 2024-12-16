import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { RecurrenceFormValues } from "@/components/projects/recurrence/types";
import { useToast } from "@/components/ui/use-toast";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

export function useRecurrenceSubmit(project: Project, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getDurationDays = (duration: "1week" | "2weeks" | "1month" | "3months") => {
    switch (duration) {
      case "1week":
        return 7;
      case "2weeks":
        return 14;
      case "1month":
        return 30;
      case "3months":
        return 90;
      default:
        return 7;
    }
  };

  const handleSubmit = async (values: RecurrenceFormValues) => {
    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + getDurationDays(values.duration));

      const scheduleDates: Date[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        if (values.weekdays.includes(currentDate.getDay())) {
          scheduleDates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const scheduledProjects = scheduleDates.map((date) => ({
        project_id: project.id,
        schedule_date: date.toISOString(),
        section: values.section,
        user_id: DEFAULT_USER_ID,
        completed: false
      }));

      const { error } = await supabase
        .from('scheduled_projects')
        .insert(scheduledProjects);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
      toast({
        title: "Succès",
        description: `Le chantier a été planifié sur ${scheduleDates.length} jours`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
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