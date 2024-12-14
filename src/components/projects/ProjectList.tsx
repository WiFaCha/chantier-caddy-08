import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";
import { useState } from "react";
import { Project } from "@/types/calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      
      return (data || []).map(project => ({
        ...project,
        color: project.color as "violet" | "blue" | "green" | "red",
        type: project.type as "Mensuel" | "Ponctuel"
      }));
    },
  });

  const handleCreateProject = async (data: Omit<Project, "id" | "user_id">) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert([{
          ...data,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDialogOpen(false);
      toast({
        title: "Succès",
        description: "Le chantier a été créé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (id: string, data: Omit<Project, "id" | "user_id">) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Succès",
        description: "Le chantier a été mis à jour avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Succès",
        description: "Le chantier a été supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

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