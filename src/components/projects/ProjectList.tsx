import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Project } from "@/types/calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProjectListHeader } from "./ProjectListHeader";
import { ProjectListContent } from "./ProjectListContent";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

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
        .select('*')
        .eq('user_id', DEFAULT_USER_ID);
      
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
          user_id: DEFAULT_USER_ID
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
        .update({
          ...data,
          user_id: DEFAULT_USER_ID
        })
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
        .eq('id', id)
        .eq('user_id', DEFAULT_USER_ID);

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
      <ProjectListHeader
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onCreateProject={handleCreateProject}
      />
      <Input
        type="search"
        placeholder="Rechercher un chantier..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <ProjectListContent
        projects={filteredProjects}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
}