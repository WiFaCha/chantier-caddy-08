import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";

export function ProjectList() {
  const projects = [
    {
      title: "Mirabeau",
      address: "22 Rue Mirabeau, Angers",
      price: 60.40,
      type: "Mensuel" as const,
      details: "Vitres : 2/5/8/11",
    },
    {
      title: "rue mirabeau",
      address: "",
      price: 60.00,
      type: "Ponctuel" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Catalogue des Chantiers</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouveau Chantier
        </Button>
      </div>
      <div className="grid gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}