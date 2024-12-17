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
      // On commence par obtenir la date actuelle
      const now = new Date();
      
      // On crée la date de début en UTC à midi
      const startTimestamp = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        12, 0, 0, 0
      );
      
      const durationDays = getDurationDays(values.duration);
      
      // On calcule la date de fin
      const endTimestamp = startTimestamp + (durationDays * 24 * 60 * 60 * 1000);
      
      const scheduleDates: Date[] = [];
      let currentTimestamp = startTimestamp;

      console.log('Date de début:', new Date(startTimestamp).toISOString());
      console.log('Date de fin:', new Date(endTimestamp).toISOString());

      // On utilise des timestamps pour l'itération
      while (currentTimestamp < endTimestamp) {
        const currentDate = new Date(currentTimestamp);
        
        if (values.weekdays.includes(currentDate.getUTCDay())) {
          scheduleDates.push(new Date(currentTimestamp));
        }
        
        // On ajoute 48 heures en millisecondes au lieu de 24
        currentTimestamp += 48 * 60 * 60 * 1000;
      }

      console.log('Dates planifiées:', scheduleDates.map(d => ({
        iso: d.toISOString(),
        utcDay: d.getUTCDay(),
        localDay: d.getDay(),
        timestamp: d.getTime()
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