import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const simpleRecurrenceSchema = z.object({
  numberOfDays: z.string().transform((val) => parseInt(val, 10)),
});

type SimpleRecurrenceValues = z.infer<typeof simpleRecurrenceSchema>;

interface SimpleRecurrenceFormProps {
  onSubmit: (values: SimpleRecurrenceValues) => void;
}

export function SimpleRecurrenceForm({ onSubmit }: SimpleRecurrenceFormProps) {
  const form = useForm<SimpleRecurrenceValues>({
    resolver: zodResolver(simpleRecurrenceSchema),
    defaultValues: {
      numberOfDays: "1",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="numberOfDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de jours consécutifs</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
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