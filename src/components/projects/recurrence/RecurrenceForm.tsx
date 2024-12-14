import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { RecurrenceFormValues } from "./types";

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
            <FormItem>
              <FormLabel>Date de fin (jj/mm/aaaa)</FormLabel>
              <FormControl>
                <Input
                  placeholder="jj/mm/aaaa"
                  value={field.value ? format(new Date(field.value), 'dd/MM/yyyy') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [day, month, year] = e.target.value.split('/').map(Number);
                      const date = new Date(year, month - 1, day);
                      if (isValid(date)) {
                        field.onChange(date);
                      }
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                  className={cn(
                    "w-full",
                    !field.value && "text-muted-foreground"
                  )}
                />
              </FormControl>
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