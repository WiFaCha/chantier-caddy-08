import { useCalendarState } from "./calendar/useCalendarState";
import { useProjectsQuery } from "./calendar/useProjectsQuery";
import { useScheduledProjectsQuery } from "./calendar/useScheduledProjectsQuery";
import { useProjectOperations } from "./calendar/useProjectOperations";

export function useCalendar() {
  const { currentDate, setCurrentDate, viewMode, setViewMode } = useCalendarState();
  const { data: projects = [] } = useProjectsQuery();
  const { scheduledProjects = [], refetchScheduledProjects } = useScheduledProjectsQuery();
  const { 
    handleAddProject,
    handleToggleComplete,
    handleTimeChange,
    handleSectionChange
  } = useProjectOperations(refetchScheduledProjects);

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    projects,
    scheduledProjects,
    handleAddProject,
    handleToggleComplete,
    handleTimeChange,
    handleSectionChange
  };
}