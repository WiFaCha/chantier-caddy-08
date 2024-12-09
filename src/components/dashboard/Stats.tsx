import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface Project {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "Mensuel" | "Ponctuel";
  details?: string;
  color: "violet" | "blue" | "green" | "red";
  scheduleId?: string;
  date?: Date;
}

export function Stats() {
  const { data: scheduledProjects = [] } = useQuery({
    queryKey: ['scheduledProjects'],
    queryFn: async () => {
      const stored = localStorage.getItem('scheduledProjects');
      return stored ? JSON.parse(stored).map((p: any) => ({ ...p, date: new Date(p.date) })) : [];
    },
  });

  const todayProjects = scheduledProjects.filter((project: Project) => {
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
            {todayProjects.map((project: Project) => (
              <div
                key={project.scheduleId}
                className={`rounded p-3 ${
                  project.color === "violet"
                    ? "bg-violet-100 text-violet-900"
                    : project.color === "blue"
                    ? "bg-blue-100 text-blue-900"
                    : project.color === "green"
                    ? "bg-green-100 text-green-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                <div className="font-medium">{project.title}</div>
                {project.address && (
                  <div className="text-sm">{project.address}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}