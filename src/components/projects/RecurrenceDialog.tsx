import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  weekdays: z.array(z.number()),
  endDate: z.date(),
});

type RecurrenceFormValues = z.infer<typeof formSchema>;

interface Project {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "Mensuel" | "Ponctuel";
  details?: string;
  color: "violet" | "blue" | "green" | "red";
}

interface RecurrenceDialogProps {
  project: Project;
  trigger: React.ReactNode;
}

export function RecurrenceDialog({ project, trigger }: RecurrenceDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RecurrenceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weekdays: [],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  const handleSubmit = async (data: RecurrenceFormValues) => {
    try {
      // Créer les dates de début et fin en UTC
      const startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      
      const endDate = new Date(data.endDate);
      endDate.setUTCHours(23, 59, 59, 999);
      
      const weekdays = data.weekdays;
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        if (weekdays.includes(currentDate.getDay())) {
          // Créer la date en UTC pour l'insertion
          const scheduleDate = new Date(Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ));
          
          const { error } = await supabase
            .from('scheduled_projects')
            .insert({
              project_id: project.id,
              schedule_date: scheduleDate.toISOString().split('T')[0],
              user_id: (await supabase.auth.getUser()).data.user?.id
            });
          
          if (error) throw error;
        }
        // Avancer d'un jour en préservant l'heure UTC
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
      
      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
      form.reset();
      setOpen(false);
      
      toast({
        title: "Succès",
        description: "Les chantiers ont été planifiés avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Planifier la récurrence</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                          }
                        }}
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
            <Button type="submit" className="w-full">
              Planifier
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}