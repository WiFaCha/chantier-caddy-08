import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { RecurrenceFormValues } from "@/components/projects/recurrence/types";
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { addDays } from "date-fns";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
const TIMEZONE = "Europe/Paris";

// Étape 1 : Calculer la durée
const getDurationDays = (duration: "1week" | "2weeks" | "1month" | "3months"): number => {
  const durationMap = {
    "1week": 7,
    "2weeks": 14,
    "1month": 30,
    "3months": 90,
  };
  return durationMap[duration] || 7;
};

// Étape 2 : Créer une plage de dates
const createDateRange = (startDate: Date, durationDays: number) => {
  const startDateAtNoon = zonedTimeToUtc(
    new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12, 0, 0),
    TIMEZONE
  );

  const startTimestamp = startDateAtNoon.getTime();
  const endTimestamp = startTimestamp + durationDays * 2 * 24 * 60 * 60 * 1000;

  return { startTimestamp, endTimestamp };
};

// Étape 3 : Générer les dates
const generateScheduleDates = (
  startTimestamp: number,
  endTimestamp: number,
  selectedWeekdays: number[]
): Date[] => {
  const scheduleDates: Date[] = [];
  let currentTimestamp = startTimestamp;

  while (currentTimestamp <= endTimestamp) {
    const currentDate = utcToZonedTime(new Date(currentTimestamp), TIMEZONE);
    const localDay = currentDate.getDay();

    if (selectedWeekdays.includes(localDay)) {
      scheduleDates.push(
        zonedTimeToUtc(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            12,
            0,
            0
          ),
          TIMEZONE
        )
      );
    }
  }

  return scheduleDates;
};

// Étape 4 : Créer les tâches planifiées
const createScheduledProjects = (
  scheduleDates: Date[],
  projectId: string,
  section: "morning" | "afternoon"
) => {
  return scheduleDates.map((date) => ({
    project_id: projectId,
    schedule_date: formatInTimeZone(date, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    section,
    user_id: DEFAULT_USER_ID,
    completed: false,
  }));
};

// Étape 5 : Hook principal
export function useRecurrenceSubmit(project: Project, onSuccess: () => void) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (values: RecurrenceFormValues) => {
    try {
      console.log("Étape 1 : Soumission avec les valeurs", values);

      const now = new Date();
      const durationDays = getDurationDays(values.duration);
      const { startTimestamp, endTimestamp } = createDateRange(now, durationDays);

      console.log("Étape 2 : Plage de dates générée", {
        startTimestamp,
        endTimestamp,
      });

      const scheduleDates = generateScheduleDates(
        startTimestamp,
        endTimestamp,
        values.weekdays
      );

      console.log("Étape 3 : Dates générées", scheduleDates);

      const scheduledProjects = createScheduledProjects(
        scheduleDates,
        project.id,
        values.section
      );

      console.log("Étape 4 : Tâches planifiées", scheduledProjects);

      const { error } = await supabase
        .from("scheduled_projects")
        .insert(scheduledProjects);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["scheduledProjects"] });
      toast({
        title: "Succès",
        description: "Les tâches ont été planifiées avec succès",
      });
      onSuccess();
    } catch (error: any) {
      console.error("Erreur dans handleSubmit", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return handleSubmit;
}
