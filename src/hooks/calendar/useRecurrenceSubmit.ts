import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { RecurrenceFormValues } from "@/components/projects/recurrence/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

export function useRecurrenceSubmit(project: Project, onSuccess: () => void) {
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
      // On commence par obtenir la date actuelle à minuit UTC
      const now = new Date();
      const startDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      ));

      const durationDays = getDurationDays(values.duration);
      const endDate = new Date(startDate);
      endDate.setUTCDate(startDate.getUTCDate() + durationDays);

      const scheduleDates: Date[] = [];
      const currentDate = new Date(startDate);

      // Debug
      console.log('Date de début:', startDate.toISOString());
      console.log('Date de fin:', endDate.toISOString());

      while (currentDate < endDate) {
        // On vérifie si le jour de la semaine est inclus dans les jours sélectionnés
        if (values.weekdays.includes(currentDate.getUTCDay())) {
          // On crée une nouvelle date pour éviter les références
          const scheduleDate = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate(),
            12 // Midi UTC pour éviter les problèmes de changement de jour
          ));
          scheduleDates.push(scheduleDate);
        }
        // On avance d'un jour en UTC
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }

      // Debug
      console.log('Dates planifiées:', scheduleDates.map(d => ({
        iso: d.toISOString(),
        utcDay: d.getUTCDay(),
        localDay: d.getDay()
      })));

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