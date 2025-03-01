
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

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
    // For direct webview navigation using the real property ID
    navigate(`/property/${propertyId}/webview`);
  }, [propertyId, navigate]);

  return {
    handleGeneratePDF,
    handleWebView,
    showWebView,
    setShowWebView
  };
}
