import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { ScheduledProject } from "@/types/calendar";

export function Stats() {
  const { data: scheduledProjects = [], refetch } = useQuery({
    queryKey: ['scheduledProjects'],
    queryFn: async () => {
      const stored = localStorage.getItem('scheduledProjects');
      return stored ? JSON.parse(stored).map((p: any) => ({ ...p, date: new Date(p.date) })) : [];
    },
  });

  const handleToggleComplete = (scheduleId: string) => {
    const updatedProjects = scheduledProjects.map((project: ScheduledProject) => {
      if (project.scheduleId === scheduleId) {
        return { ...project, completed: !project.completed };
      }
      return project;
    });
    localStorage.setItem('scheduledProjects', JSON.stringify(updatedProjects));
    refetch();
  };

  const todayProjects = scheduledProjects.filter((project: ScheduledProject) => {
    if (!project.date) return false;
    const today = new Date();
    const projectDate = new Date(project.date);
    return (
      projectDate.getDate() === today.getDate() &&
      projectDate.getMonth() === today.getMonth() &&
      projectDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chantiers du jour</CardTitle>
      </CardHeader>
      <CardContent>
        {todayProjects.length === 0 ? (
          <p className="text-muted-foreground">Aucun chantier prévu aujourd'hui</p>
        ) : (
          <div className="space-y-4">
            {todayProjects.map((project: ScheduledProject) => (
              <div
                key={project.scheduleId}
                className={`rounded p-3 flex items-center gap-3 ${
                  project.color === "violet"
                    ? "bg-violet-100 text-violet-900"
                    : project.color === "blue"
                    ? "bg-blue-100 text-blue-900"
                    : project.color === "green"
                    ? "bg-green-100 text-green-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                <Checkbox
                  checked={project.completed}
                  onCheckedChange={() => handleToggleComplete(project.scheduleId)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <div>
                  <div className="font-medium">{project.title}</div>
                  {project.address && (
                    <div className="text-sm">{project.address}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}