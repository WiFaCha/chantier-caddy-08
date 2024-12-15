export interface Project {
  id: string;
  title: string;
  address: string;
  price: number;
  details?: string;
  color: "violet" | "blue" | "green" | "red";
  type: "Mensuel" | "Ponctuel";
  user_id?: string;
  window_cleaning?: string[];
  time?: string;
  section?: 'morning' | 'afternoon';
}

export interface ScheduledProject extends Project {
  scheduleId: string;
  date: Date;
  completed?: boolean;
  time?: string;
  section: 'morning' | 'afternoon';
}

export interface SupabaseScheduledProject {
  id: string;
  project_id: string;
  schedule_date: string;
  created_at?: string;
  user_id: string;
  completed?: boolean;
  time?: string;
  section: 'morning' | 'afternoon';
}