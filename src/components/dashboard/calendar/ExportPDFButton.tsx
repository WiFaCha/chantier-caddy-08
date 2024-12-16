import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface ExportPDFButtonProps {
  calendarRef: React.RefObject<HTMLDivElement>;
  viewMode: "month" | "week" | "twoWeeks";
}

export function ExportPDFButton({ calendarRef, viewMode }: ExportPDFButtonProps) {
  const handleExport = async () => {
    if (!calendarRef.current) return;

    try {
      toast.loading("Génération du PDF en cours...");
      
      // Temporarily modify styles for better PDF rendering
      const originalStyle = calendarRef.current.style.cssText;
      calendarRef.current.style.width = "100%";
      calendarRef.current.style.height = "auto";
      calendarRef.current.style.overflow = "visible";
      
      // Find all project cards and temporarily modify their styles
      const projectCards = calendarRef.current.querySelectorAll('[class*="truncate"]');
      projectCards.forEach((card: any) => {
        card.style.whiteSpace = "normal";
        card.style.overflow = "visible";
        card.style.textOverflow = "clip";
      });

      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1920,
        onclone: (document, element) => {
          // Additional styling for the cloned element
          element.style.transform = "scale(1)";
          element.style.width = "100%";
          element.style.height = "auto";
        }
      });

      // Reset styles
      calendarRef.current.style.cssText = originalStyle;
      projectCards.forEach((card: any) => {
        card.style.whiteSpace = "";
        card.style.overflow = "";
        card.style.textOverflow = "";
      });

      // Calculate dimensions for PDF
      const imgWidth = 297; // A4 width in mm (landscape)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Add the image with proper scaling
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

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