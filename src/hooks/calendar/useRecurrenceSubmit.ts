import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { RecurrenceFormValues } from "@/components/projects/recurrence/types";
import { toZonedTime, formatInTimeZone, addDays } from 'date-fns-tz';

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
const TIMEZONE = 'Europe/Paris';

// Activer le mode de débogage global
(window as any).DEBUG_RECURRENCE = true;

const debugLog = (...args: any[]) => {
  if ((window as any).DEBUG_RECURRENCE) {
    console.log('[RECURRENCE DEBUG]', ...args);
  }
};

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
  // Convertir la date de début à midi dans le fuseau horaire de Paris
  const startOfDayInParis = toZonedTime(startDate, TIMEZONE);
  
  const startDateAtNoon = new Date(
    startOfDayInParis.getFullYear(),
    startOfDayInParis.getMonth(),
    startOfDayInParis.getDate(),
    12, 0, 0, 0
  );

  const startTimestamp = startDateAtNoon.getTime();
  const endTimestamp = startTimestamp + (durationDays * 24 * 60 * 60 * 1000);
  
  return { startTimestamp, endTimestamp };
};

const generateScheduleDates = (
  startTimestamp: number,
  endTimestamp: number,
  selectedWeekdays: number[]
): Date[] => {
  debugLog('Génération des dates de planification', {
    startTimestamp,
    endTimestamp,
    selectedWeekdays
  });

  const scheduleDates: Date[] = [];
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  debugLog('Plage de dates', {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  });

  let currentDate = startDate;
  while (currentDate <= endDate) {
    const zonedCurrentDate = toZonedTime(currentDate, TIMEZONE);
    const localDay = zonedCurrentDate.getDay();

    debugLog('Analyse de la date', {
      currentDate: currentDate.toISOString(),
      zonedDate: zonedCurrentDate.toISOString(),
      localDay,
      isSelectedDay: selectedWeekdays.includes(localDay)
    });

    if (selectedWeekdays.includes(localDay)) {
      const scheduledDate = new Date(
        zonedCurrentDate.getFullYear(), 
        zonedCurrentDate.getMonth(), 
        zonedCurrentDate.getDate(), 
        12, 0, 0
      );
      
      scheduleDates.push(scheduledDate);
    }

    currentDate = addDays(currentDate, 1);
  }

  debugLog('Dates planifiées', scheduleDates.map(d => ({
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
  debugLog('Création des projets planifiés', {
    nombreDeDates: scheduleDates.length,
    section,
    projectId
  });

  const scheduledProjects = scheduleDates.map((date) => {
    const scheduledProject = {
      project_id: projectId,
      schedule_date: formatInTimeZone(date, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      section,
      user_id: DEFAULT_USER_ID,
      completed: false
    };

    debugLog('Projet planifié', {
      date: scheduledProject.schedule_date,
      jour: formatInTimeZone(date, TIMEZONE, 'EEEE'),
      timestamp: date.getTime()
    });

    return scheduledProject;
  });

  debugLog('Projets planifiés finaux', scheduledProjects);

  return scheduledProjects;
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
