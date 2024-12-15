import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Pencil, RotateCw, Trash } from "lucide-react";
import { ProjectDialog } from "../ProjectDialog";
import { RecurrenceDialog } from "../RecurrenceDialog";
import { Project } from "@/types/calendar";

interface ProjectHeaderProps {
  title: string;
  address: string;
  project: Pick<Project, "id" | "title" | "address" | "price" | "details" | "color" | "type" | "window_cleaning">;
  onUpdate: (data: Required<Omit<Project, "id" | "user_id" | "time" | "section">>) => void;
  onDelete: () => void;
}

export function ProjectHeader({ title, address, project, onUpdate, onDelete }: ProjectHeaderProps) {
  const handleAddressClick = () => {
    if (address) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    }
  };

  return (
    <CardHeader className="grid grid-cols-[1fr_160px] items-start gap-4 space-y-0">
      <div className="space-y-1">
        <CardTitle>{title}</CardTitle>
        <button 
          onClick={handleAddressClick}
          className="flex items-center text-sm text-primary hover:text-primary-dark transition-colors"
        >
          <MapPin className="mr-1 h-4 w-4" />
          {address || "Aucune adresse"}
        </button>
      </div>
      <div className="flex items-center space-x-1">
        <RecurrenceDialog
          project={project}
          trigger={
            <Button variant="ghost" size="icon">
              <RotateCw className="h-4 w-4" />
            </Button>
          }
        />
        <ProjectDialog
          project={project}
          onSubmit={onUpdate}
          trigger={
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}