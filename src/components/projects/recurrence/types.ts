import { z } from "zod";

export const recurrenceFormSchema = z.object({
  weekdays: z.array(z.number()),
  endDate: z.date(),
});

export type RecurrenceFormValues = z.infer<typeof recurrenceFormSchema>;