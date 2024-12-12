import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Pencil, RotateCw, Trash } from "lucide-react";
import { ProjectDialog } from "./ProjectDialog";
import { RecurrenceDialog } from "./RecurrenceDialog";
import { Project } from "@/types/calendar";

interface ProjectCardProps {
  id: string;
  title: string;
  address: string;
  price: number;
  details?: string;
  color: "violet" | "blue" | "green" | "red";
  type: "Mensuel" | "Ponctuel";
  onUpdate: (data: Omit<Project, "id">) => void;
  onDelete: () => void;
}

export function ProjectCard({ id, title, address, price, details, color, type, onUpdate, onDelete }: ProjectCardProps) {
  const borderColor = {
    violet: "border-violet-500",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
  }[color];

  const handleAddressClick = () => {
    if (address) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    }
  };

  return (
    <Card className={`relative overflow-hidden border-l-4 ${borderColor}`}>
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
            project={{ id, title, address, price, details, color, type }}
            trigger={
              <Button variant="ghost" size="icon">
                <RotateCw className="h-4 w-4" />
              </Button>
            }
          />
          <ProjectDialog
            project={{ title, address, price, details, color, type }}
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
      <CardContent>
        <div className="flex justify-between">
          <div className="text-2xl font-bold">{price.toFixed(2)} €</div>
        </div>
        {details && <p className="mt-2 text-sm text-muted-foreground">{details}</p>}
      </CardContent>
    </Card>
  );
}