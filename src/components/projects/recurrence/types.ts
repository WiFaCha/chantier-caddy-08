import { z } from "zod";

export const recurrenceFormSchema = z.object({
  weekdays: z.array(z.number()).min(1, "Sélectionnez au moins un jour"),
  endDate: z.date(),
});

export type RecurrenceFormValues = z.infer<typeof recurrenceFormSchema>;