import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { getProjectsForDay } from "@/utils/calendarUtils";

interface ExportPDFButtonProps {
  calendarRef: React.RefObject<HTMLDivElement>;
  viewMode: "month" | "week" | "twoWeeks";
}

export function ExportPDFButton({ calendarRef, viewMode }: ExportPDFButtonProps) {
  const handleExport = () => {
    if (!calendarRef.current) return;

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
      
      // En-tête
      pdf.setFont("helvetica", "bold");
      pdf.text("Calendrier", margin, margin + 5);
      pdf.setFont("helvetica", "normal");
      
      // Création du tableau
      const days = Array.from(calendarRef.current.querySelectorAll('[class*="Card"]')).map(day => {
        const dateHeader = day.querySelector('time')?.textContent || '';
        const morningProjects = Array.from(day.querySelectorAll('[class*="morning"]')).map(p => p.textContent);
        const afternoonProjects = Array.from(day.querySelectorAll('[class*="afternoon"]')).map(p => p.textContent);
        
        return {
          date: dateHeader,
          morning: morningProjects.join('\n'),
          afternoon: afternoonProjects.join('\n')
        };
      });

      // Configuration du tableau
      const columns = ['Date', 'Matin', 'Après-midi'];
      const columnWidth = (pageWidth - (2 * margin)) / columns.length;
      
      // En-têtes du tableau
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, margin + 10, pageWidth - (2 * margin), 10, 'F');
      columns.forEach((col, i) => {
        pdf.text(col, margin + (i * columnWidth) + 5, margin + 16);
      });

      // Contenu du tableau
      let yPos = margin + 25;
      const rowHeight = 20;

      days.forEach((day, index) => {
        if (yPos + rowHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = margin + 10;
        }

        // Lignes du tableau
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        
        // Contenu des cellules
        pdf.text(day.date, margin + 5, yPos + 5);
        pdf.text(day.morning || '-', margin + columnWidth + 5, yPos + 5);
        pdf.text(day.afternoon || '-', margin + (2 * columnWidth) + 5, yPos + 5);

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