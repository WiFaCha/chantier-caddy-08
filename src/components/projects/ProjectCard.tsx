import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Pencil, Trash } from "lucide-react";
import { ProjectDialog } from "./ProjectDialog";

interface ProjectCardProps {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "Mensuel" | "Ponctuel";
  details?: string;
  color: "violet" | "blue" | "green" | "red";
  onUpdate: (data: Omit<ProjectCardProps, "id" | "onUpdate" | "onDelete">) => void;
  onDelete: () => void;
}

export function ProjectCard({ id, title, address, price, type, details, color, onUpdate, onDelete }: ProjectCardProps) {
  const borderColor = {
    violet: "border-violet-500",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
  }[color];

  return (
    <Card className={`relative overflow-hidden border-l-4 ${borderColor}`}>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            {address}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <ProjectDialog
            project={{ title, address, price, type, details, color }}
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
          <div className="text-sm text-muted-foreground">{type}</div>
        </div>
        {details && <p className="mt-2 text-sm text-muted-foreground">{details}</p>}
      </CardContent>
    </Card>
  );
}