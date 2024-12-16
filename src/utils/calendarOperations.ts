import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";

export const toggleProjectComplete = async (scheduleId: string, currentCompleted: boolean) => {
  const { error } = await supabase
    .from('scheduled_projects')
    .update({ completed: !currentCompleted })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const updateProjectTime = async (scheduleId: string, time: string) => {
  const { error } = await supabase
    .from('scheduled_projects')
    .update({ time })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const updateProjectSection = async (scheduleId: string, section: 'morning' | 'afternoon') => {
  const { error } = await supabase
    .from('scheduled_projects')
    .update({ section })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const addProjectToCalendar = async (
  project: Project, 
  scheduleDate: Date,
  time?: string,
  section: 'morning' | 'afternoon' = 'morning'
) => {
  const { error } = await supabase
    .from('scheduled_projects')
    .insert([{
      project_id: project.id,
      schedule_date: scheduleDate.toISOString(),
      time: time || null,
      section: section,
      completed: false
    }]);

  if (error) throw error;
};

export const deleteScheduledProject = async (scheduleId: string) => {
  const { error } = await supabase
    .from('scheduled_projects')
    .delete()
    .eq('id', scheduleId);

  if (error) throw error;
};