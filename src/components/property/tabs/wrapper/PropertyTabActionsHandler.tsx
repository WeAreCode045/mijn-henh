
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { useState } from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";
import { useToast } from "@/hooks/use-toast";

interface PropertyTabActionsHandlerProps {
  propertyId: string;
  propertyData?: PropertyData;
  settings?: AgencySettings;
  isArchived?: boolean;
  children: (props: {
    webViewOpen: boolean;
    setWebViewOpen: (open: boolean) => void;
    handleGeneratePDF: () => void;
    handleOpenWebView: (e: React.MouseEvent) => void;
  }) => React.ReactNode;
}

export function PropertyTabActionsHandler({ 
  propertyId, 
  propertyData,
  settings,
  isArchived = false,
  children 
}: PropertyTabActionsHandlerProps) {
  const [webViewOpen, setWebViewOpen] = useState(false);
  const { handleWebView } = usePropertyActions(propertyId);
  const { generatePDF } = useGeneratePDF();
  const { toast } = useToast();

  // Web view functions - opens in new tab
  const handleOpenWebView = (e: React.MouseEvent) => {
    console.log('PropertyTabActionsHandler: handleOpenWebView called');
    
    if (isArchived) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      toast({
        title: "Error",
        description: "Cannot open web view for archived property",
        variant: "destructive",
      });
      
      return false;
    }
    
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      
      return false;
    }
    
    // Call the handleWebView function from usePropertyActions
    console.log('Opening web view for property:', propertyId);
    return handleWebView(e);
  };

  // PDF generation function
  const handleGeneratePDF = async () => {
    console.log('PropertyTabActionsHandler: handleGeneratePDF called');
    
    if (isArchived) {
      console.log('Cannot generate PDF for archived property');
      toast({
        title: "Error",
        description: "Cannot generate PDF for archived property",
        variant: "destructive",
      });
      return;
    }
    
    if (!propertyId) {
      console.log('Cannot generate PDF: Property ID is missing');
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    if (propertyData) {
      try {
        console.log('Generating PDF for property:', propertyId);
        await generatePDF(propertyData);
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: "Error",
          description: "Failed to generate PDF",
          variant: "destructive",
        });
      }
    } else {
      console.error('Cannot generate PDF: propertyData is undefined');
      toast({
        title: "Error",
        description: "Property data is missing",
        variant: "destructive",
      });
    }
  };

  return children({
    webViewOpen,
    setWebViewOpen,
    handleGeneratePDF,
    handleOpenWebView
  });
}
