import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { RecurrenceFormValues } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface RecurrenceFormProps {
  form: UseFormReturn<RecurrenceFormValues>;
  onSubmit: (data: RecurrenceFormValues) => void;
}

export function RecurrenceForm({ form, onSubmit }: RecurrenceFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="weekdays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jours de la semaine</FormLabel>
              <div className="flex gap-2">
                {[
                  ["Lun", 1],
                  ["Mar", 2],
                  ["Mer", 3],
                  ["Jeu", 4],
                  ["Ven", 5],
                  ["Sam", 6],
                  ["Dim", 0],
                ].map(([label, value]) => (
                  <div
                    key={value}
                    className="flex flex-col items-center gap-1"
                  >
                    <Checkbox
                      checked={field.value?.includes(Number(value))}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), Number(value)]
                          : field.value?.filter((day) => day !== Number(value)) || [];
                        field.onChange(updatedValue);
                      }}
                    />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />
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
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "P", { locale: fr })
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
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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