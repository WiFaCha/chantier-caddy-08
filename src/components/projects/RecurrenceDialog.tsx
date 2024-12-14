import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Project } from "@/types/calendar";
import { RecurrenceForm } from "./recurrence/RecurrenceForm";
import { RecurrenceFormValues, recurrenceFormSchema } from "./recurrence/types";
import { useRecurrenceSubmit } from "./recurrence/useRecurrenceSubmit";

interface RecurrenceDialogProps {
  project: Project;
  trigger: React.ReactNode;
}

export function RecurrenceDialog({ project, trigger }: RecurrenceDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<RecurrenceFormValues>({
    resolver: zodResolver(recurrenceFormSchema),
    defaultValues: {
      weekdays: [],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  const handleSubmit = useRecurrenceSubmit(project, () => {
    form.reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Planifier la récurrence</DialogTitle>
        </DialogHeader>
        <RecurrenceForm form={form} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}