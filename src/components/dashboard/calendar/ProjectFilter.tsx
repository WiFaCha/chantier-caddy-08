import { Button } from "@/components/ui/button";
import { Project } from "@/types/calendar";
import { Check } from "lucide-react";

interface ProjectFilterProps {
  projects: Project[];
  selectedProjects: string[];
  onToggleProject: (projectId: string) => void;
}

export function ProjectFilter({ projects, selectedProjects, onToggleProject }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {projects.map((project) => (
        <Button
          key={project.id}
          variant="outline"
          size="sm"
          className={`relative ${
            project.color === "violet"
              ? "hover:bg-violet-100"
              : project.color === "blue"
              ? "hover:bg-blue-100"
              : project.color === "green"
              ? "hover:bg-green-100"
              : "hover:bg-red-100"
          }`}
          onClick={() => onToggleProject(project.id)}
        >
          {selectedProjects.includes(project.id) && (
            <Check className="h-4 w-4 mr-2" />
          )}
          {project.title}
        </Button>
      ))}
    </div>
  );
}