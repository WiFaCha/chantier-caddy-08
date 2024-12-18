import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { RecurrenceFormValues } from "@/components/projects/recurrence/types";
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

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

import { toZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const createDateRange = (startDate: Date, durationDays: number) => {
  // Assurez-vous que startDate est interprété dans le fuseau horaire local
  const startOfDayInParis = toZonedTime(startDate, TIMEZONE);

  // Force l'heure de début à 12:00 dans le fuseau horaire local
  const startDateAtNoon = new Date(
    startOfDayInParis.getFullYear(),
    startOfDayInParis.getMonth(),
    startOfDayInParis.getDate(),
    12, 0, 0, 0
  );

  // Convertit la date locale en UTC pour éviter les décalages
  const startTimestamp = zonedTimeToUtc(startDateAtNoon, TIMEZONE).getTime();

  const endTimestamp = startTimestamp + durationDays * 24 * 60 * 60 * 1000;

  return { startTimestamp, endTimestamp };
};


import { addDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const generateScheduleDates = (
  startTimestamp: number,
  endTimestamp: number,
  selectedWeekdays: number[]
): Date[] => {
  const scheduleDates: Date[] = [];
  let currentTimestamp = startTimestamp;

  while (currentTimestamp < endTimestamp) {
    // Convertit le timestamp en date locale (Europe/Paris)
    const currentDate = utcToZonedTime(new Date(currentTimestamp), TIMEZONE);

    const localDay = currentDate.getDay(); // Jour local

    if (selectedWeekdays.includes(localDay)) {
      scheduleDates.push(new Date(currentTimestamp)); // Ajout de la date exacte
    }

    // Ajoute 1 jour en UTC
    currentTimestamp += 24 * 60 * 60 * 1000;
  }

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

      console.log('Dates planifiées:', scheduleDates.map(d => ({
        local: formatInTimeZone(d, TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz'),
        day: formatInTimeZone(d, TIMEZONE, 'EEEE'),
      })));

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
