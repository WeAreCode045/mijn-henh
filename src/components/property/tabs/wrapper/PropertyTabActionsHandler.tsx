
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
    handleGeneratePDF: (e: React.MouseEvent) => void;
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

  // Web view function - directly opens in new tab with improved handling
  const handleOpenWebView = (e: React.MouseEvent) => {
    console.log('PropertyTabActionsHandler: handleOpenWebView called for property', propertyId);
    e.preventDefault(); // Prevent default navigation
    e.stopPropagation(); // Stop event propagation
    
    // Simple validation
    if (!propertyId) {
      console.error('Cannot open web view: Property ID is missing');
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return false;
    }
    
    if (isArchived) {
      console.error('Cannot open web view: Property is archived');
      toast({
        title: "Error",
        description: "Cannot open web view for archived property",
        variant: "destructive",
      });
      return false;
    }
    
    // Call the handleWebView function directly
    try {
      console.log('Calling handleWebView for property:', propertyId);
      return handleWebView(e);
    } catch (error) {
      console.error('Error opening web view:', error);
      toast({
        title: "Error",
        description: "Failed to open web view",
        variant: "destructive",
      });
      return false;
    }
  };

  // PDF generation function - simplified for direct usage
  const handleGeneratePDF = (e: React.MouseEvent) => {
    console.log('PropertyTabActionsHandler: handleGeneratePDF called for property', propertyId);
    e.preventDefault();
    e.stopPropagation();
    
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
        console.log('Calling generatePDF for property:', propertyId);
        generatePDF(propertyData);
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
