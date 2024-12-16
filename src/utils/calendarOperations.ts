import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";

// Using a default user ID since authentication has been removed
const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

export const toggleProjectComplete = async (scheduleId: string, currentCompleted: boolean) => {
  const { error } = await supabase
    .from('scheduled_projects')
    .update({ 
      completed: !currentCompleted,
      user_id: DEFAULT_USER_ID 
    })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const updateProjectTime = async (scheduleId: string, time: string) => {
  const { error } = await supabase
    .from('scheduled_projects')
    .update({ 
      time,
      user_id: DEFAULT_USER_ID 
    })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const updateProjectSection = async (scheduleId: string, section: 'morning' | 'afternoon') => {
  const { error } = await supabase
    .from('scheduled_projects')
    .update({ 
      section,
      user_id: DEFAULT_USER_ID 
    })
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
      completed: false,
      user_id: DEFAULT_USER_ID
    }]);

  if (error) throw error;
};

export const deleteScheduledProject = async (scheduleId: string) => {
  const { error } = await supabase
    .from('scheduled_projects')
    .delete()
    .eq('id', scheduleId)
    .eq('user_id', DEFAULT_USER_ID);

  if (error) throw error;
};