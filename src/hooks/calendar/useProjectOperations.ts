import { useToast } from "@/components/ui/use-toast";
import { Project } from "@/types/calendar";
import { addProjectToCalendar, toggleProjectComplete, updateProjectSection, updateProjectTime } from "@/utils/calendarOperations";

export function useProjectOperations(refetchScheduledProjects: () => Promise<any>) {
  const { toast } = useToast();

  const handleAddProject = async (day: number, project: Project) => {
    try {
      const scheduleDate = new Date(Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        day
      ));
      
      await addProjectToCalendar(project, scheduleDate, project.time, project.section);
      await refetchScheduledProjects();
      
      toast({
        title: "Succès",
        description: "Le chantier a été planifié avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (scheduleId: string) => {
    try {
      await toggleProjectComplete(scheduleId, false);
      await refetchScheduledProjects();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTimeChange = async (scheduleId: string, time: string) => {
    try {
      await updateProjectTime(scheduleId, time);
      await refetchScheduledProjects();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSectionChange = async (scheduleId: string, section: 'morning' | 'afternoon') => {
    try {
      await updateProjectSection(scheduleId, section);
      await refetchScheduledProjects();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    handleAddProject,
    handleToggleComplete,
    handleTimeChange,
    handleSectionChange
  };
}