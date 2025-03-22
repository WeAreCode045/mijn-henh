
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/property";

export function usePropertyActions(propertyId: string) {
  const navigate = useNavigate();
  const [showWebView, setShowWebView] = useState(false);

  const handleGeneratePDF = useCallback((e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("Generate PDF for property:", propertyId);
    // The implementation will be provided by the actual PDF generator
  }, [propertyId]);

  const handleWebView = useCallback((e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Open in a new tab with simplified URL structure
    window.open(`/${propertyId}/webview`, '_blank', 'noopener,noreferrer');
    
    // Return false to ensure no further actions are taken
    return false;
  }, [propertyId]);

  return {
    handleGeneratePDF,
    handleWebView,
    showWebView,
    setShowWebView
  };
}
