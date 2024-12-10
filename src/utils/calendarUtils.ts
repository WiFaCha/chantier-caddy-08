import { ScheduledProject } from "@/types/calendar";

export const getProjectsForDay = (
  scheduledProjects: ScheduledProject[],
  day: number,
  month: number,
  year: number
) => {
  return scheduledProjects.filter(project => {
    const projectDate = new Date(project.date);
    return (
      projectDate.getDate() === day &&
      projectDate.getMonth() === month &&
      projectDate.getFullYear() === year
    );
  });
};

export const getDaysToDisplay = (currentDate: Date, viewMode: "month" | "week" | "twoWeeks", isMobile: boolean) => {
  const result = [];
  let startDate = new Date(currentDate);

  if (viewMode === "month") {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    if (!isMobile) {
      const firstDayOfMonth = startDate.getDay();
      const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
      for (let i = 0; i < adjustedFirstDay; i++) {
        result.push(null);
      }
    }
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
  } else {
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate = new Date(startDate.setDate(diff));
    const daysToShow = viewMode === "week" ? 7 : 14;
    for (let i = 0; i < daysToShow; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      result.push(currentDay);
    }
  }

  return result;
};