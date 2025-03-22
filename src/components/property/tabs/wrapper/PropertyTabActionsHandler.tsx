
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { useState } from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";

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

  // Web view functions - opens in new tab
  const handleOpenWebView = (e: React.MouseEvent) => {
    if (isArchived) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      return false;
    }
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    return handleWebView(e);
  };

  // PDF generation function
  const handleGeneratePDF = async () => {
    console.log('PropertyTabActionsHandler: handleGeneratePDF called');
    
    if (isArchived) {
      console.log('Cannot generate PDF for archived property');
      return;
    }
    
    if (propertyData) {
      await generatePDF(propertyData);
    } else {
      console.error('Cannot generate PDF: propertyData is undefined');
    }
  };

  return children({
    webViewOpen,
    setWebViewOpen,
    handleGeneratePDF,
    handleOpenWebView
  });
}
