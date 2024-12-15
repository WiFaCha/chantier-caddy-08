import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Pencil, RotateCw, Trash } from "lucide-react";
import { ProjectDialog } from "./ProjectDialog";
import { RecurrenceDialog } from "./RecurrenceDialog";
import { Project } from "@/types/calendar";

type ProjectCardProps = {
  id: string;
  title: string;
  address: string;
  price: number;
  details?: string;
  color: Project['color'];
  type: "Mensuel" | "Ponctuel";
  window_cleaning?: string[];
  onUpdate: (data: Required<Omit<Project, "id" | "user_id" | "time" | "section">>) => void;
  onDelete: () => void;
}

export function ProjectCard({ 
  id, 
  title, 
  address, 
  price, 
  details, 
  color, 
  type, 
  window_cleaning, 
  onUpdate, 
  onDelete 
}: ProjectCardProps) {
  const borderColor = {
    violet: "border-violet-500",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    magenta: "border-[#D946EF]",
    orange: "border-[#F97316]",
    ocean: "border-[#0EA5E9]",
    purple: "border-[#8B5CF6]"
  }[color];

  const handleAddressClick = () => {
    if (address) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

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
            project={{ id, title, address, price, details, color, type, window_cleaning }}
            trigger={
              <Button variant="ghost" size="icon">
                <RotateCw className="h-4 w-4" />
              </Button>
            }
          />
          <ProjectDialog
            project={{ title, address, price, details, color, type, window_cleaning }}
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
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="text-2xl font-bold">{price.toFixed(2)} €</div>
          </div>
          {window_cleaning && window_cleaning.length > 0 && (
            <div className="text-sm">
              <div className="font-medium mb-1">Nettoyage des vitres :</div>
              <div className="flex flex-wrap gap-1">
                {window_cleaning.map((monthIndex) => (
                  <span key={monthIndex} className="bg-gray-100 px-2 py-1 rounded-md">
                    {months[parseInt(monthIndex) - 1]}
                  </span>
                ))}
              </div>
            </div>
          )}
          {details && <p className="text-sm text-muted-foreground">{details}</p>}
        </div>
      </CardContent>
    </Card>
  );
}