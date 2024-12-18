import React, { useMemo } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects'; // Assuming you have a hook to fetch projects
import { useCalendar } from '@/hooks/useCalendar'; // Assuming you have a hook to manage calendar events

export function MonthlyChantiersDashboard() {
  const { projects } = useProjects();
  const { events } = useCalendar();

  const monthlyChantiers = useMemo(() => {
    return projects.filter(project => 
      project.monthly_frequency === '1x' || project.monthly_frequency === '2x'
    );
  }, [projects]);

  const checkMonthlyFrequency = (project) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const projectEvents = events.filter(event => 
      event.projectId === project.id && 
      new Date(event.date).getMonth() === currentMonth &&
      new Date(event.date).getFullYear() === currentYear
    );

    const requiredFrequency = project.monthly_frequency === '1x' ? 1 : 2;
    return projectEvents.length === requiredFrequency;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">Chantiers Mensuels</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Chantier</th>
            <th className="text-center p-2">Fréquence</th>
          </tr>
        </thead>
        <tbody>
          {monthlyChantiers.map((project) => (
            <tr key={project.id} className="border-b">
              <td className="p-2">{project.title}</td>
              <td className="p-2 text-center">
                {checkMonthlyFrequency(project) ? (
                  <CheckIcon className="text-green-500 mx-auto" />
                ) : (
                  <XIcon className="text-red-500 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
