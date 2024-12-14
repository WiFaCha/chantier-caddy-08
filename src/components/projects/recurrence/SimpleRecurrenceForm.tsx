import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const simpleRecurrenceSchema = z.object({
  weekdays: z.array(z.number()).min(1, "Sélectionnez au moins un jour"),
  duration: z.enum(["1week", "2weeks", "1month", "3months"]),
});

type SimpleRecurrenceValues = z.infer<typeof simpleRecurrenceSchema>;

interface SimpleRecurrenceFormProps {
  onSubmit: (values: SimpleRecurrenceValues) => void;
}

export function SimpleRecurrenceForm({ onSubmit }: SimpleRecurrenceFormProps) {
  const form = useForm<SimpleRecurrenceValues>({
    resolver: zodResolver(simpleRecurrenceSchema),
    defaultValues: {
      weekdays: [],
      duration: "1week",
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
    { value: "1week", label: "1 semaine" },
    { value: "2weeks", label: "2 semaines" },
    { value: "1month", label: "1 mois" },
    { value: "3months", label: "3 mois" },
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

        <Button type="submit" className="w-full">
          Planifier
        </Button>
      </form>
    </Form>
  );
}