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
      
      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
        unit: "mm",
      });

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.8),
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      const fileName = `calendrier-${viewMode}-${new Date().toLocaleDateString()}.pdf`;
      pdf.save(fileName);
      
      toast.dismiss();
      toast.success("PDF généré avec succès");
    } catch (error) {
      toast.dismiss();
      toast.error("Erreur lors de la génération du PDF");
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