import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { RecurrenceFormValues } from "./types";

interface RecurrenceFormProps {
  form: UseFormReturn<RecurrenceFormValues>;
  onSubmit: (values: RecurrenceFormValues) => void;
}

export function RecurrenceForm({ form, onSubmit }: RecurrenceFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de fin</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weekdays"
          render={() => (
            <FormItem>
              <FormLabel>Jours de la semaine</FormLabel>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 1, label: "Lun" },
                  { value: 2, label: "Mar" },
                  { value: 3, label: "Mer" },
                  { value: 4, label: "Jeu" },
                  { value: 5, label: "Ven" },
                  { value: 6, label: "Sam" },
                  { value: 0, label: "Dim" },
                ].map((day) => (
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
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Planifier
        </Button>
      </form>
    </Form>
  );
}