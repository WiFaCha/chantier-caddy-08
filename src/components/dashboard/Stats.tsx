import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock } from "lucide-react";
import { ScheduledProject } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { StatsProjectList } from "./stats/StatsProjectList";

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

  const todayProjects = scheduledProjects.filter((project: ScheduledProject) => {
    if (!project.date) return false;
    const today = new Date();
    return (
      project.date.getDate() === today.getDate() &&
      project.date.getMonth() === today.getMonth() &&
      project.date.getFullYear() === today.getFullYear()
    );
  });

  const sortProjects = (projects: ScheduledProject[]) => {
    return [...projects].sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  const morningProjects = sortProjects(todayProjects.filter(p => {
    if (!p.section && !p.time) return true;
    if (p.section === 'morning') return true;
    if (p.section === 'afternoon') return false;
    if (!p.time) return true;
    const time = parseInt(p.time.split(':')[0]);
    return time < 12;
  }));

  const afternoonProjects = sortProjects(todayProjects.filter(p => {
    if (p.section === 'afternoon') return true;
    if (p.section === 'morning') return false;
    if (!p.time) return false;
    const time = parseInt(p.time.split(':')[0]);
    return time >= 12;
  }));

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
            <StatsProjectList
              title="Matin"
              projects={morningProjects}
              onToggleComplete={handleToggleComplete}
              onAddressClick={handleAddressClick}
            />
            <div className="border-t border-border" />
            <StatsProjectList
              title="Après-midi"
              projects={afternoonProjects}
              onToggleComplete={handleToggleComplete}
              onAddressClick={handleAddressClick}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}