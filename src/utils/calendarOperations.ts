import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/calendar";
import { getCurrentUser } from "./supabaseUtils";

export const toggleProjectComplete = async (scheduleId: string, currentCompleted: boolean) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from('scheduled_projects')
    .update({ 
      completed: !currentCompleted,
      user_id: user.id
    })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const updateProjectTime = async (scheduleId: string, time: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // First, get the existing record
  const { data: existingProject } = await supabase
    .from('scheduled_projects')
    .select('*')
    .eq('id', scheduleId)
    .single();

  if (!existingProject) throw new Error("Project not found");

  const { error } = await supabase
    .from('scheduled_projects')
    .update({ 
      ...existingProject,
      time: time,
      user_id: user.id
    })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const updateProjectSection = async (scheduleId: string, section: 'morning' | 'afternoon') => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  // First, get the existing record
  const { data: existingProject } = await supabase
    .from('scheduled_projects')
    .select('*')
    .eq('id', scheduleId)
    .single();

  if (!existingProject) throw new Error("Project not found");

  const { error } = await supabase
    .from('scheduled_projects')
    .update({ 
      ...existingProject,
      section: section,
      user_id: user.id
    })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const addProjectToCalendar = async (
  project: Project, 
  scheduleDate: Date,
  time?: string,
  section?: 'morning' | 'afternoon'
) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from('scheduled_projects')
    .insert([{
      project_id: project.id,
      schedule_date: scheduleDate.toISOString(),
      user_id: user.id,
      time: time,
      section: section || 'morning', // Default to morning if no section provided
      completed: false // Explicitly set default value
    }]);

  if (error) throw error;
};