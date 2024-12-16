import { CalendarView } from "./CalendarView";
import { useCalendar } from "@/hooks/useCalendar";

export function CalendarContainer() {
  const {
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
  } = useCalendar();

  return (
    <CalendarView
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      viewMode={viewMode}
      setViewMode={setViewMode}
      projects={projects}
      scheduledProjects={scheduledProjects}
      onAddProject={handleAddProject}
      onDeleteProject={handleDeleteProject}
      onToggleComplete={handleToggleComplete}
      onTimeChange={handleTimeChange}
      onSectionChange={handleSectionChange}
    />
  );
}