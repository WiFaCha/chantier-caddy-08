import { supabase } from "@/integrations/supabase/client";

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};