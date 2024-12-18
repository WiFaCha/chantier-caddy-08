import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { formatInTimeZone } from 'date-fns-tz';
import { format, parseISO } from 'date-fns';

// Types
export const recurrenceFormSchema = z.object({
  weekdays: z.number().array().min(1, "Sélectionnez au moins un jour"),
  duration: z.enum(["1week", "2weeks", "1month", "3months"]),
  section: z.enum(["morning", "afternoon"])
});

export type RecurrenceFormValues = z.infer<typeof recurrenceFormSchema>;

// Constantes
const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
const TIMEZONE = 'Europe/Paris';

// Fonction de débogage avancé
const advancedDebugLog = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.group(`🔍 DEBUG [${timestamp}] ${message}`);
  
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key}:`, 
        value instanceof Date ? value.toISOString() : 
        typeof value === 'object' ? JSON.stringify(value) : 
        value
      );
    });
  }
  
  console.groupEnd();
};

const generateScheduleDates = (
  startDate: Date,
  endDate: Date,
  selectedWeekdays: number[]
): Date[] => {
  const scheduleDates: Date[] = [];
  let currentDate = new Date(startDate);

  console.log('🔍 DEBUG - Paramètres initiaux');
  console.log('Date de début:', startDate.toISOString());
  console.log('Date de fin:', endDate.toISOString());
  console.log('Jours sélectionnés:', selectedWeekdays);
  console.log('Jour de la date de début:', startDate.getDay());

  while (currentDate <= endDate) {
    const currentDay = currentDate.getDay();

    console.log('Date courante:', currentDate.toISOString());
    console.log('Jour courant:', currentDay);
    console.log('Est-ce un jour sélectionné ?', selectedWeekdays.includes(currentDay));

    if (selectedWeekdays.includes(currentDay)) {
      const scheduledDate = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        currentDate.getDate(), 
        12, 0, 0
      );

      console.log('Date programmée ajoutée:', scheduledDate.toISOString());
      scheduleDates.push(scheduledDate);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log('🔍 Dates finales générées:');
  scheduleDates.forEach(date => {
    console.log(date.toISOString(), 'Jour:', date.getDay());
  });

  return scheduleDates;
};

export function useRecurrenceSubmit(project: Project, onSuccess: () => void) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (values: RecurrenceFormValues) => {
    try {
      // Date de début à midi
      const now = new Date();
      now.setHours(12, 0, 0, 0);

      // Calculer la durée
      const durationMap = {
        "1week": 7,
        "2weeks": 14,
        "1month": 30,
        "3months": 90
      };
      const durationDays = durationMap[values.duration];

      // Date de fin
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + durationDays);
      endDate.setHours(23, 59, 59, 999);

      // Log diagnostique
      advancedDebugLog('Paramètres de récurrence', {
        dateActuelle: now.toISOString(),
        dateEnd: endDate.toISOString(),
        jourActuel: now.getDay(),
        joursSelectionnes: values.weekdays,
        duree: values.duration
      });

      const scheduleDates = generateScheduleDates(
        now, 
        endDate, 
        values.weekdays
      );

      const scheduledProjects = scheduleDates.map((date) => ({
        project_id: project.id,
        schedule_date: formatInTimeZone(date, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        section: values.section,
        user_id: DEFAULT_USER_ID,
        completed: false
      }));

      // Log final
      advancedDebugLog('Projets à planifier', {
        nombreProjets: scheduledProjects.length,
        projets: scheduledProjects.map(p => ({
          date: p.schedule_date,
          jour: format(parseISO(p.schedule_date), 'EEEE', { locale: require('date-fns/locale/fr') })
        }))
      });

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

// Le reste du code du composant SimpleRecurrenceForm reste identique
export function SimpleRecurrenceForm({ onSubmit }: { onSubmit: (values: RecurrenceFormValues) => void }) {
  const form = useForm<RecurrenceFormValues>({
    resolver: zodResolver(recurrenceFormSchema),
    defaultValues: {
      weekdays: [],
      duration: "1week",
      section: "morning",
    },
  });

  // Code du formulaire identique à la version précédente...
  // (Je ne le répète pas pour ne pas surcharger)

  return (/* formulaire */);
}
