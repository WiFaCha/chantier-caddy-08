import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock } from "lucide-react";
import { ScheduledProject } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export function Stats() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: scheduledProjects = [] } = useQuery({
    queryKey: ['scheduledProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_projects')
        .select(`
          *,
          project:projects(*)
        `);
      
      if (error) throw error;
      
      return data.map((sp: any) => ({
        ...sp.project,
        color: sp.project.color as "violet" | "blue" | "green" | "red",
        type: sp.project.type as "Mensuel" | "Ponctuel",
        scheduleId: sp.id,
        date: new Date(sp.schedule_date),
        completed: sp.completed,
        time: sp.time,
        section: sp.section
      })) || [];
    },
  });

  const handleToggleComplete = async (scheduleId: string) => {
    try {
      const currentProject = scheduledProjects.find(project => project.scheduleId === scheduleId);
      const { error } = await supabase
        .from('scheduled_projects')
        .update({ completed: !currentProject?.completed })
        .eq('id', scheduleId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const scheduledProjectsSubscription = supabase
      .channel('scheduled_projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_projects'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['scheduledProjects'] });
        }
      )
      .subscribe();

    return () => {
      scheduledProjectsSubscription.unsubscribe();
    };
  }, [queryClient]);

  const handleAddressClick = (address: string) => {
    if (address) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const isWindowCleaningMonth = (project: ScheduledProject) => {
    if (!project?.window_cleaning) return false;
    const currentMonth = (project.date.getMonth() + 1).toString();
    return project.window_cleaning.includes(currentMonth);
  };

  const todayProjects = scheduledProjects.filter((project: ScheduledProject) => {
    if (!project.date) return false;
    const today = new Date();
    return (
      project.date.getDate() === today.getDate() &&
      project.date.getMonth() === today.getMonth() &&
      project.date.getFullYear() === today.getFullYear()
    );
  });

  const morningProjects = todayProjects.filter(p => {
    if (!p.time && !p.section) return true;
    if (p.section === 'morning') return true;
    if (!p.time) return false;
    const time = parseInt(p.time.split(':')[0]);
    return time < 12;
  });

  const afternoonProjects = todayProjects.filter(p => {
    if (p.section === 'afternoon') return true;
    if (!p.time) return false;
    const time = parseInt(p.time.split(':')[0]);
    return time >= 12;
  });

  const renderProjects = (projects: ScheduledProject[], title: string) => (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {projects.map((project: ScheduledProject) => (
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
          <div className="flex-1">
            <div className="font-medium">{project.title}</div>
            {project.address && (
              <button 
                onClick={() => handleAddressClick(project.address)}
                className="flex items-center text-sm hover:underline"
              >
                <MapPin className="mr-1 h-4 w-4" />
                Itinéraire
              </button>
            )}
            <div className="flex items-center gap-2 mt-1">
              {project.time && (
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4" />
                  {project.time}
                </div>
              )}
              {isWindowCleaningMonth(project) && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                  Vitres
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chantiers du jour</CardTitle>
      </CardHeader>
      <CardContent>
        {todayProjects.length === 0 ? (
          <p className="text-muted-foreground">Aucun chantier prévu aujourd'hui</p>
        ) : (
          <div className="space-y-6">
            {renderProjects(morningProjects, "Matin")}
            <div className="border-t border-border" />
            {renderProjects(afternoonProjects, "Après-midi")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}