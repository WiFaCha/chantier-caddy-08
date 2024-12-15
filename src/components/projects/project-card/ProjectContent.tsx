import { CardContent } from "@/components/ui/card";

interface ProjectContentProps {
  price: number;
  details?: string;
  window_cleaning?: string[];
}

export function ProjectContent({ price, details, window_cleaning }: ProjectContentProps) {
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">{price.toFixed(2)} €</div>
        </div>
        {window_cleaning && window_cleaning.length > 0 && (
          <div className="text-sm">
            <div className="font-medium mb-1">Nettoyage des vitres :</div>
            <div className="flex flex-wrap gap-1">
              {window_cleaning.map((monthIndex) => (
                <span key={monthIndex} className="bg-gray-100 px-2 py-1 rounded-md">
                  {months[parseInt(monthIndex) - 1]}
                </span>
              ))}
            </div>
          </div>
        )}
        {details && <p className="text-sm text-muted-foreground">{details}</p>}
      </div>
    </CardContent>
  );
}