
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PropertyFormData, PropertyData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

export function useGeneratePDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (elementId: string, fileName: string, propertyData: PropertyFormData) => {
    setIsGenerating(true);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element not found");
      }

      // Make PDF generation container visible if it was hidden
      element.style.display = "block";

      // Convert property form data to property data for PDF generation
      // This cast handles the required vs. optional fields discrepancy
      const pdfPropertyData = propertyData as unknown as PropertyData;

      // Capture all content in the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // Return element to original state if it was hidden
      // element.style.display = "none";

      // PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Initialize PDF document
      const pdf = new jsPDF("p", "mm", "a4");
      const pageData = canvas.toDataURL("image/jpeg", 1.0);

      // First page
      pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Additional pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`${fileName}.pdf`);

      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
}
