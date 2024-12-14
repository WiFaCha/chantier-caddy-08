import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Project } from "@/types/calendar";
import { SimpleRecurrenceForm } from "./recurrence/SimpleRecurrenceForm";
import { useRecurrenceSubmit } from "./recurrence/useRecurrenceSubmit";

interface RecurrenceDialogProps {
  project: Project;
  trigger: React.ReactNode;
}

export function RecurrenceDialog({ project, trigger }: RecurrenceDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = useRecurrenceSubmit(project, () => {
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Planifier la récurrence</DialogTitle>
        </DialogHeader>
        <SimpleRecurrenceForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}