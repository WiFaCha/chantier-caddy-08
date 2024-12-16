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

  const { error } = await supabase
    .from('scheduled_projects')
    .update({ 
      time: time,
      user_id: user.id
    })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const updateProjectSection = async (scheduleId: string, section: 'morning' | 'afternoon') => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from('scheduled_projects')
    .update({ 
      section: section,
      user_id: user.id
    })
    .eq('id', scheduleId);

  if (error) throw error;
};

export const addProjectToCalendar = async (
  project: Project,
  scheduleDate: Date,
  time: string | undefined,
  section: 'morning' | 'afternoon' | undefined
) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from('scheduled_projects')
    .insert([{
      project_id: project.id,
      schedule_date: scheduleDate.toISOString().split('T')[0],
      user_id: user.id,
      time: time,
      section: section
    }]);

  if (error) throw error;
};