import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { RecurrenceFormValues } from "@/components/projects/recurrence/types";
import { zonedTimeToUtc, utcToZonedTime, formatInTimeZone } from 'date-fns-tz';
import { addDays } from 'date-fns';

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
const TIMEZONE = 'Europe/Paris';

const getDurationDays = (duration: "1week" | "2weeks" | "1month" | "3months"): number => {
  const durationMap = {
    "1week": 7,
    "2weeks": 14,
    "1month": 30,
    "3months": 90
  };
  return durationMap[duration] || 7;
};

const createDateRange = (startDate: Date, durationDays: number) => {
  // Convertir en heure locale à midi dans le fuseau horaire de Paris
  const startOfDayInParis = utcToZonedTime(startDate, TIMEZONE);
  const startDateAtNoon = new Date(
    startOfDayInParis.getFullYear(),
    startOfDayInParis.getMonth(),
    startOfDayInParis.getDate(),
    12, 0, 0, 0
  );

  // Convertir la date locale à midi en UTC pour garantir la cohérence
  const startTimestamp = zonedTimeToUtc(startDateAtNoon, TIMEZONE).getTime();
  const endTimestamp = startTimestamp + durationDays * 24 * 60 * 60 * 1000;

  return { startTimestamp, endTimestamp };
};

const generateScheduleDates = (
  startTimestamp: number,
  endTimestamp: number,
  selectedWeekdays: number[]
): Date[] => {
  const scheduleDates: Date[] = [];
  let currentTimestamp = startTimestamp;

  while (currentTimestamp < endTimestamp) {
    // Convertir le timestamp actuel en date locale (Europe/Paris)
    const currentDate = utcToZonedTime(new Date(currentTimestamp), TIMEZONE);
    const localDay = currentDate.getDay();

    // Vérifier si le jour de la semaine correspond
    if (selectedWeekdays.includes(localDay)) {
      // Créer une date UTC correcte alignée à midi
      const scheduledDate = zonedTimeToUtc(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          12, 0, 0, 0
        ),
        TIMEZONE
      );
      scheduleDates.push(scheduledDate);
    }

    // Ajouter 1 jour en UTC
    currentTimestamp += 24 * 60 * 60 * 1000;
  }

  console.log('Dates planifiées:', scheduleDates.map(d => ({
    local: formatInTimeZone(d, TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz'),
    day: formatInTimeZone(d, TIMEZONE, 'EEEE'),
    timestamp: d.getTime()
  })));

  return scheduleDates;
};

const createScheduledProjects = (
  scheduleDates: Date[],
  projectId: string,
  section: 'morning' | 'afternoon'
) => {
  return scheduleDates.map((date) => ({
    project_id: projectId,
    schedule_date: formatInTimeZone(date, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    section,
    user_id: DEFAULT_USER_ID,
    completed: false
  }));
};

export function useRecurrenceSubmit(project: Project, onSuccess: () => void) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (values: RecurrenceFormValues) => {
    try {
      const now = new Date();
      const durationDays = getDurationDays(values.duration);
      const { startTimestamp, endTimestamp } = createDateRange(now, durationDays);

      const scheduleDates = generateScheduleDates(
        startTimestamp,
        endTimestamp,
        values.weekdays
      );

      const scheduledProjects = createScheduledProjects(
        scheduleDates,
        project.id,
        values.section
      );

      const { error } = await supabase
        .from('scheduled_projects')
        .insert(scheduledProjects);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
      toast({
        title: "Succès",
        description: "Les tâches ont été planifiées avec succès",
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
