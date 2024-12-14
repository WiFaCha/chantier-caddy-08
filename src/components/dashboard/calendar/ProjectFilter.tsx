import { Button } from "@/components/ui/button";
import { Project } from "@/types/calendar";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ProjectFilterProps {
  projects: Project[];
  selectedProjects: string[];
  onToggleProject: (projectId: string) => void;
}

export function ProjectFilter({ projects, selectedProjects, onToggleProject }: ProjectFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayLimit = 5;
  
  const visibleProjects = isExpanded ? projects : projects.slice(0, displayLimit);
  const hasMoreProjects = projects.length > displayLimit;

  return (
    <div className="space-y-2 mb-4">
      <div className="flex flex-wrap gap-2">
        {visibleProjects.map((project) => (
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
      {hasMoreProjects && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Voir moins
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Voir plus ({projects.length - displayLimit} autres chantiers)
            </>
          )}
        </Button>
      )}
    </div>
  );
}