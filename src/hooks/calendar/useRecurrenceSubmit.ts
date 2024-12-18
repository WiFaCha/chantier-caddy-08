import * as z from "zod";
import { useState } from "react";
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

// Types
export const recurrenceFormSchema = z.object({
  weekdays: z.number().array().min(1, "Sélectionnez au moins un jour"),
  duration: z.enum(["1week", "2weeks", "1month", "3months"]),
  section: z.enum(["morning", "afternoon"])
});

export type RecurrenceFormValues = z.infer<typeof recurrenceFormSchema>;

// Constantes et utilitaires
const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";
const TIMEZONE = 'Europe/Paris';

// Activer le mode de débogage global
(window as any).DEBUG_RECURRENCE = true;

const debugLog = (...args: any[]) => {
  if ((window as any).DEBUG_RECURRENCE) {
    console.log('[RECURRENCE DEBUG]', ...args);
  }
};

// Fonctions utilitaires pour la récurrence
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
  const startDateAtNoon = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
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
  const scheduleDates: Date[] = [];
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  console.group('🔍 Génération des dates');
  console.log('Paramètres initiaux:', {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    selectedWeekdays
  });

  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const currentDay = currentDate.getDay(); 

    if (selectedWeekdays.includes(currentDay)) {
      const scheduledDate = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        currentDate.getDate(), 
        12, 0, 0
      );

      scheduleDates.push(scheduledDate);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.groupEnd();

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

// Hook personnalisé pour soumettre la récurrence
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

// Composant de formulaire de récurrence
interface SimpleRecurrenceFormProps {
  onSubmit: (values: RecurrenceFormValues) => void;
}

export function SimpleRecurrenceForm({ onSubmit }: SimpleRecurrenceFormProps) {
  const form = useForm<RecurrenceFormValues>({
    resolver: zodResolver(recurrenceFormSchema),
    defaultValues: {
      weekdays: [],
      duration: "1week",
      section: "morning",
    },
  });

  const weekdays = [
    { value: 1, label: "Lun" },
    { value: 2, label: "Mar" },
    { value: 3, label: "Mer" },
    { value: 4, label: "Jeu" },
    { value: 5, label: "Ven" },
    { value: 6, label: "Sam" },
    { value: 0, label: "Dim" },
  ];

  const durations = [
    { value: "1week" as const, label: "1 semaine" },
    { value: "2weeks" as const, label: "2 semaines" },
    { value: "1month" as const, label: "1 mois" },
    { value: "3months" as const, label: "3 mois" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Jours de la semaine</label>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((day) => (
              <Button
                key={day.value}
                type="button"
                variant={form.watch("weekdays")?.includes(day.value) ? "default" : "outline"}
                className="w-14"
                onClick={() => {
                  const currentWeekdays = form.watch("weekdays") || [];
                  const newWeekdays = currentWeekdays.includes(day.value)
                    ? currentWeekdays.filter((d) => d !== day.value)
                    : [...currentWeekdays, day.value];
                  form.setValue("weekdays", newWeekdays);
                }}
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Durée</label>
          <div className="flex flex-wrap gap-2">
            {durations.map((duration) => (
              <Button
                key={duration.value}
                type="button"
                variant={form.watch("duration") === duration.value ? "default" : "outline"}
                onClick={() => form.setValue("duration", duration.value)}
              >
                {duration.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Après-midi</span>
          <Switch
            checked={form.watch("section") === "afternoon"}
            onCheckedChange={(checked) => form.setValue("section", checked ? "afternoon" : "morning")}
          />
        </div>

        <Button type="submit" className="w-full">
          Planifier
        </Button>
      </form>
    </Form>
  );
}
