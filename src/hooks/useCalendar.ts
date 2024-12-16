import { useCalendarState } from "./calendar/useCalendarState";
import { useProjectsQuery } from "./calendar/useProjectsQuery";
import { useScheduledProjectsQuery } from "./calendar/useScheduledProjectsQuery";
import { useProjectOperations } from "./calendar/useProjectOperations";
import { deleteScheduledProject } from "@/utils/calendarOperations";
import { useToast } from "@/components/ui/use-toast";

export function useCalendar() {
  const { toast } = useToast();
  const { currentDate, setCurrentDate, viewMode, setViewMode } = useCalendarState();
  const { data: projects = [] } = useProjectsQuery();
  const { scheduledProjects = [], refetchScheduledProjects } = useScheduledProjectsQuery();
  const { 
    handleAddProject,
    handleToggleComplete,
    handleTimeChange,
    handleSectionChange
  } = useProjectOperations(refetchScheduledProjects);

  const handleDeleteProject = async (scheduleId: string) => {
    try {
      await deleteScheduledProject(scheduleId);
      await refetchScheduledProjects();
      toast({
        title: "Succès",
        description: "Le projet a été supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    projects,
    scheduledProjects,
    handleAddProject,
    handleDeleteProject,
    handleToggleComplete,
    handleTimeChange,
    handleSectionChange
  };
}