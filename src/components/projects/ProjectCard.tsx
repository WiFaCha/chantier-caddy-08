import { Card } from "@/components/ui/card";
import { Project } from "@/types/calendar";
import { ProjectHeader } from "./project-card/ProjectHeader";
import { ProjectContent } from "./project-card/ProjectContent";

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
    red: "border-red-500"
  }[color];

  const project = { id, title, address, price, details, color, type, window_cleaning };

  return (
    <Card className={`relative overflow-hidden border-l-4 ${borderColor}`}>
      <ProjectHeader
        title={title}
        address={address}
        project={project}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
      <ProjectContent
        price={price}
        details={details}
        window_cleaning={window_cleaning}
      />
    </Card>
  );
}