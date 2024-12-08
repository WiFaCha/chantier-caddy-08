import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Pencil, Trash } from "lucide-react";

interface ProjectCardProps {
  title: string;
  address: string;
  price: number;
  type: "Mensuel" | "Ponctuel";
  details?: string;
}

export function ProjectCard({ title, address, price, type, details }: ProjectCardProps) {
  return (
    <Card className="relative overflow-hidden border-l-4 border-l-primary">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            {address}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
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