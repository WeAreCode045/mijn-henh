
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

export function usePropertyActions(propertyId: string) {
  const navigate = useNavigate();
  const [showWebView, setShowWebView] = useState(false);

  const handleGeneratePDF = useCallback(async (e?: React.MouseEvent, property?: PropertyData, settings?: AgencySettings) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
    }

    if (property && settings) {
      await generatePropertyPDF(property, settings);
    } else {
      console.log("Generate PDF for property:", propertyId);
    }
  }, [propertyId]);

  const handleWebView = useCallback((e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
    }
    
    // Open in a new tab with simplified URL structure
    window.open(`/${propertyId}/webview`, '_blank');
  }, [propertyId]);

  return {
    handleGeneratePDF,
    handleWebView,
    showWebView,
    setShowWebView
  };
}
