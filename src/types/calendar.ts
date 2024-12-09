export interface Project {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "Mensuel" | "Ponctuel";
  details?: string;
  color: "violet" | "blue" | "green" | "red";
}

export interface ScheduledProject extends Project {
  scheduleId: string;
  date: Date;
  completed?: boolean;
}