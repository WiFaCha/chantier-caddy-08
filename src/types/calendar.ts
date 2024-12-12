export interface Project {
  id: string;
  title: string;
  address: string;
  price: number;
  details?: string;
  color: "violet" | "blue" | "green" | "red";
  type: "Mensuel" | "Ponctuel";
}

export interface ScheduledProject extends Project {
  scheduleId: string;
  date: Date;
  completed?: boolean;
  time?: string;
}