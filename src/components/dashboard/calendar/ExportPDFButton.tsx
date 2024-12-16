import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { ScheduledProject } from "@/types/calendar";

interface ExportPDFButtonProps {
  calendarRef: React.RefObject<HTMLDivElement>;
  viewMode: "month" | "week" | "twoWeeks";
  scheduledProjects: ScheduledProject[];
  currentDate: Date;
}

export function ExportPDFButton({ calendarRef, viewMode, scheduledProjects, currentDate }: ExportPDFButtonProps) {
  const handleExport = () => {
    try {
      toast.loading("Génération du PDF en cours...");
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Configuration du PDF
      pdf.setFontSize(12);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      // En-tête avec le mois et l'année
      const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      pdf.setFont("helvetica", "bold");
      pdf.text(monthYear, margin, margin + 5);
      pdf.setFont("helvetica", "normal");

      // Configuration du tableau
      const columns = ['Date', 'Matin', 'Après-midi'];
      const columnWidth = (pageWidth - (2 * margin)) / columns.length;
      
      // En-têtes du tableau
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, margin + 10, pageWidth - (2 * margin), 10, 'F');
      columns.forEach((col, i) => {
        pdf.text(col, margin + (i * columnWidth) + 5, margin + 16);
      });

      // Regrouper les projets par date
      const projectsByDate = scheduledProjects.reduce((acc, project) => {
        const date = new Date(project.date);
        const dateStr = date.toLocaleDateString();
        if (!acc[dateStr]) {
          acc[dateStr] = { morning: [], afternoon: [] };
        }
        if (project.section === 'morning') {
          acc[dateStr].morning.push(project);
        } else {
          acc[dateStr].afternoon.push(project);
        }
        return acc;
      }, {} as Record<string, { morning: ScheduledProject[], afternoon: ScheduledProject[] }>);

      // Contenu du tableau
      let yPos = margin + 25;
      const rowHeight = 20;
      const lineHeight = 5;

      Object.entries(projectsByDate).forEach(([dateStr, { morning, afternoon }]) => {
        if (yPos + rowHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = margin + 10;
        }

        // Lignes du tableau
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        
        // Date
        pdf.text(dateStr, margin + 5, yPos + 5);

        // Projets du matin
        const morningText = morning
          .map(p => `${p.title}${p.time ? ` (${p.time})` : ''}${p.completed ? ' ✓' : ''}`)
          .join('\n');
        pdf.text(morningText || '-', margin + columnWidth + 5, yPos + 5);

        // Projets de l'après-midi
        const afternoonText = afternoon
          .map(p => `${p.title}${p.time ? ` (${p.time})` : ''}${p.completed ? ' ✓' : ''}`)
          .join('\n');
        pdf.text(afternoonText || '-', margin + (2 * columnWidth) + 5, yPos + 5);

        yPos += rowHeight;
      });

      // Dernière ligne du tableau
      pdf.line(margin, yPos, pageWidth - margin, yPos);

      // Lignes verticales
      columns.forEach((_, i) => {
        const x = margin + (i * columnWidth);
        pdf.line(x, margin + 10, x, yPos);
      });
      pdf.line(pageWidth - margin, margin + 10, pageWidth - margin, yPos);

      const fileName = `calendrier-${viewMode}-${new Date().toLocaleDateString()}.pdf`;
      pdf.save(fileName);
      
      toast.dismiss();
      toast.success("PDF généré avec succès");
    } catch (error) {
      toast.dismiss();
      toast.error("Erreur lors de la génération du PDF");
      console.error("PDF generation error:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleExport}
    >
      <FileDown className="h-4 w-4" />
      Exporter
    </Button>
  );
}