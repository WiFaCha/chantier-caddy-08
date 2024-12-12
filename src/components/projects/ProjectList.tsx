import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";
import { useState } from "react";
import { Project } from "@/types/calendar";

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('projects');
    return stored ? JSON.parse(stored) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateProject = (data: Omit<Project, "id">) => {
    const newProjects = [...projects, { ...data, id: Date.now().toString() }];
    setProjects(newProjects);
    localStorage.setItem('projects', JSON.stringify(newProjects));
    setDialogOpen(false);
  };

  const handleUpdateProject = (id: string, data: Omit<Project, "id">) => {
    const newProjects = projects.map((project) => (project.id === id ? { ...data, id } : project));
    setProjects(newProjects);
    localStorage.setItem('projects', JSON.stringify(newProjects));
  };

  const handleDeleteProject = (id: string) => {
    const newProjects = projects.filter((project) => project.id !== id);
    setProjects(newProjects);
    localStorage.setItem('projects', JSON.stringify(newProjects));
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Catalogue des Chantiers</h2>
        <ProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleCreateProject}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nouveau Chantier
            </Button>
          }
        />
      </div>
      <Input
        type="search"
        placeholder="Rechercher un chantier..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="grid gap-4">
        {filteredProjects.map((project) => (
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