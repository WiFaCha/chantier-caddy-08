import { z } from "zod";

export const recurrenceFormSchema = z.object({
  weekdays: z.array(z.number()).min(1, "Sélectionnez au moins un jour"),
  duration: z.enum(["1week", "2weeks", "1month", "3months"]),
});

export type RecurrenceFormValues = z.infer<typeof recurrenceFormSchema>;