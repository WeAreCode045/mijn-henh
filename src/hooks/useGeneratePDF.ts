
import { useToast } from "@/components/ui/use-toast";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import type { PropertyFormData } from "@/types/property";
import { useState } from "react";
import { useAgencySettings } from "./useAgencySettings";

export function useGeneratePDF() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const { settings } = useAgencySettings();

  const generatePDF = async (property: PropertyFormData, templateId?: string) => {
    if (!property) {
      toast({
        title: "Error",
        description: "Property data is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      await generatePropertyPDF(property, settings, templateId);
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating
  };
}
