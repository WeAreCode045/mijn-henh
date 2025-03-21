
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
    
    if (!settings) {
      toast({
        title: "Error",
        description: "Agency settings are missing",
        variant: "destructive",
      });
      return;
    }

    // Ensure property has an ID, if not generate a temporary one
    const propertyWithId = {
      ...property,
      id: property.id || crypto.randomUUID()  // Add a temporary ID if none exists
    };

    try {
      console.log('Starting PDF generation for property:', propertyWithId.id);
      setIsGenerating(true);
      await generatePropertyPDF(propertyWithId, settings, templateId);
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
