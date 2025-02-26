
import { useToast } from "@/components/ui/use-toast";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import { AgencySettings } from "@/types/agency";
import { PropertyData } from "@/types/property";
import { PropertyWebView } from "./PropertyWebView";
import { useState } from "react";
import { PropertyActionButtons } from "./PropertyActionButtons";
import { PropertyTemplateSelector } from "./PropertyTemplateSelector";

interface PropertyActionsProps {
  property: PropertyData;
  settings: AgencySettings;
  onDelete: () => void;
  onSave: () => void;
}

export function PropertyActions({ 
  property, 
  settings, 
  onDelete, 
  onSave 
}: PropertyActionsProps) {
  const [isWebViewOpen, setIsWebViewOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("default");
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    try {
      // Only pass the template ID if it's not the default
      const templateId = selectedTemplateId === "default" ? "" : selectedTemplateId;
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
    }
  };

  return (
    <>
      <PropertyActionButtons
        onSave={onSave}
        onDelete={onDelete}
        onGeneratePDF={handleGeneratePDF}
        onWebView={() => setIsWebViewOpen(true)}
        propertyId={property.id}
      />

      <PropertyTemplateSelector
        selectedTemplateId={selectedTemplateId}
        onTemplateChange={setSelectedTemplateId}
      />

      <PropertyWebView
        property={property}
        open={isWebViewOpen}
        onOpenChange={setIsWebViewOpen}
      />
    </>
  );
}
