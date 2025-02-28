
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

export function usePropertyActions(propertyId: string) {
  const navigate = useNavigate();

  const handleGeneratePDF = useCallback(async (property?: PropertyData, settings?: AgencySettings) => {
    if (property && settings) {
      await generatePropertyPDF(property, settings);
    } else {
      console.log("Generate PDF for property:", propertyId);
    }
  }, [propertyId]);

  const handleWebView = useCallback(() => {
    // Use direct navigation to the property webview
    navigate(`/property/${propertyId}`);
  }, [propertyId, navigate]);

  return {
    handleGeneratePDF,
    handleWebView
  };
}
