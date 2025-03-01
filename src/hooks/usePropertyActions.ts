
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { usePropertyWebView } from "@/components/property/webview/usePropertyWebView";

export function usePropertyActions(propertyId: string) {
  const navigate = useNavigate();
  const [showWebView, setShowWebView] = useState(false);

  const handleGeneratePDF = useCallback(async (property?: PropertyData, settings?: AgencySettings) => {
    if (property && settings) {
      await generatePropertyPDF(property, settings);
    } else {
      console.log("Generate PDF for property:", propertyId);
    }
  }, [propertyId]);

  const handleWebView = useCallback(() => {
    // Instead of direct navigation, set state to show inline web view
    setShowWebView(true);
  }, [propertyId]);

  return {
    handleGeneratePDF,
    handleWebView,
    showWebView,
    setShowWebView
  };
}
