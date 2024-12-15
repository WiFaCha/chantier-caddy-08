import { Project } from "@/types/calendar";
import { ProjectCard } from "./ProjectCard";

interface ProjectListContentProps {
  projects: Project[];
  onUpdateProject: (id: string, data: Omit<Project, "id" | "user_id">) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectListContent({ projects, onUpdateProject, onDeleteProject }: ProjectListContentProps) {
  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          {...project}
          onUpdate={(data) => onUpdateProject(project.id, data)}
          onDelete={() => onDeleteProject(project.id)}
        />
      ))}
    </div>
  );
}