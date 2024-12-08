import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";
import { useState } from "react";

interface Project {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "Mensuel" | "Ponctuel";
  details?: string;
  color: "violet" | "blue" | "green" | "red";
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Mirabeau",
      address: "22 Rue Mirabeau, Angers",
      price: 60.40,
      type: "Mensuel",
      details: "Vitres : 2/5/8/11",
      color: "violet",
    },
    {
      id: "2",
      title: "rue mirabeau",
      address: "",
      price: 60.00,
      type: "Ponctuel",
      color: "blue",
    },
  ]);

  const handleCreateProject = (data: Omit<Project, "id">) => {
    setProjects([...projects, { ...data, id: Date.now().toString() }]);
  };

  const handleUpdateProject = (id: string, data: Omit<Project, "id">) => {
    setProjects(projects.map((project) => (project.id === id ? { ...data, id } : project)));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Catalogue des Chantiers</h2>
        <ProjectDialog
          onSubmit={handleCreateProject}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nouveau Chantier
            </Button>
          }
        />
      </div>
      <div className="grid gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            onUpdate={(data) => handleUpdateProject(project.id, data)}
            onDelete={() => handleDeleteProject(project.id)}
          />
        ))}
      </div>
    </div>
  );
}