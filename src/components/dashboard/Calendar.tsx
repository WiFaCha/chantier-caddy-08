import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function Calendar() {
  const [currentDate] = useState(new Date());
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Calendrier</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
          </div>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => (
            <div key={day} className="text-center font-medium">
              {day}
            </div>
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i} className="p-2">
              <div className="text-center">{i + 1}</div>
              <div className="mt-2 space-y-1">
                <Button variant="ghost" className="w-full justify-start text-left text-sm">
                  + Ajouter
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}