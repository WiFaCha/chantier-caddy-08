import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { RecurrenceFormValues } from "@/components/projects/recurrence/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

export function useRecurrenceSubmit() {
  const { toast } = useToast();

  const handleSubmit = async (project: Project, values: RecurrenceFormValues) => {
    try {
      const scheduledProjects = [];
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        if (values.selectedDays.includes(date.getDay())) {
          scheduledProjects.push({
            project_id: project.id,
            schedule_date: date.toISOString(),
            user_id: DEFAULT_USER_ID,
            section: 'morning',
          });
        }
      }

      const { error } = await supabase
        .from('scheduled_projects')
        .insert(scheduledProjects);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les projets ont été planifiés avec succès",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleSubmit };
}