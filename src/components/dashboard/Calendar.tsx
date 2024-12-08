import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ScheduledProject {
  id: string;
  projectId: string;
  title: string;
  color: "violet" | "blue" | "green" | "red";
  date: Date;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledProjects, setScheduledProjects] = useState<ScheduledProject[]>([]);
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddProject = (day: number, project: any) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setScheduledProjects([
      ...scheduledProjects,
      {
        id: Date.now().toString(),
        projectId: project.id,
        title: project.title,
        color: project.color,
        date,
      },
    ]);
  };

  const handleDeleteProject = (id: string) => {
    setScheduledProjects(scheduledProjects.filter((project) => project.id !== id));
  };

  const getProjectsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return scheduledProjects.filter(
      (project) => project.date.toDateString() === date.toDateString()
    );
  };

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Calendrier</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => (
            <div key={day} className="text-center font-medium">
              {day}
            </div>
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i} className="p-2">
              <div className="text-center">{i + 1}</div>
              <div className="mt-2 space-y-1">
                {getProjectsForDay(i + 1).map((project) => (
                  <div
                    key={project.id}
                    className={`flex items-center justify-between rounded p-1 text-sm text-white ${
                      project.color === "violet"
                        ? "bg-violet-500"
                        : project.color === "blue"
                        ? "bg-blue-500"
                        : project.color === "green"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    <span>{project.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-white hover:text-white/80"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start text-left text-sm">
                      + Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un chantier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {/* Here you would map through your projects catalog */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() =>
                          handleAddProject(i + 1, {
                            id: "test",
                            title: "Test Project",
                            color: "violet",
                          })
                        }
                      >
                        Test Project
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}