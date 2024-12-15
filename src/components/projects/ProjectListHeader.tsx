import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectDialog } from "./ProjectDialog";

interface ProjectListHeaderProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onCreateProject: (data: any) => void;
}

export function ProjectListHeader({ dialogOpen, setDialogOpen, onCreateProject }: ProjectListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold">Catalogue des Chantiers</h2>
      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onCreateProject}
        trigger={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Chantier
          </Button>
        }
      />
    </div>
  );
}