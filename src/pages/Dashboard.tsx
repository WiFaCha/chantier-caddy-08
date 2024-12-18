import { Calendar } from "@/components/dashboard/Calendar";
import { Stats } from "@/components/dashboard/Stats";
import { MonthlyChantiersDashboard } from "@/components/dashboard/MonthlyChantiersDashboard";

export default function Dashboard() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <Stats />
      <Calendar />
      <MonthlyChantiersDashboard />
    </div>
  );
}
