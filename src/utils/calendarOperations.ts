import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { getCurrentUser } from "./supabaseUtils";

export const toggleProjectComplete = async (scheduleId: string, currentCompleted: boolean) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from('scheduled_projects')
    .update({ completed: !currentCompleted })
    .eq('id', scheduleId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const updateProjectTime = async (scheduleId: string, time: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from('scheduled_projects')
    .update({ time })
    .eq('id', scheduleId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const updateProjectSection = async (scheduleId: string, section: 'morning' | 'afternoon') => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from('scheduled_projects')
    .update({ section })
    .eq('id', scheduleId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const addProjectToCalendar = async (
  project: Project, 
  scheduleDate: Date,
  time?: string,
  section: 'morning' | 'afternoon' = 'morning'
) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // First check if user owns this project
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project.id)
    .eq('user_id', user.id)
    .single();

  if (projectError || !projectData) {
    throw new Error("Project not found or unauthorized");
  }

  const { error } = await supabase
    .from('scheduled_projects')
    .insert([{
      project_id: project.id,
      schedule_date: scheduleDate.toISOString(),
      user_id: user.id,
      time: time || null,
      section: section,
      completed: false
    }]);

  if (error) throw error;
};

export const deleteScheduledProject = async (scheduleId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from('scheduled_projects')
    .delete()
    .eq('id', scheduleId)
    .eq('user_id', user.id);

  if (error) throw error;
};