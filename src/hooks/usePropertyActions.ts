
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/property";

export function usePropertyActions(propertyId: string) {
  const navigate = useNavigate();
  const [showWebView, setShowWebView] = useState(false);

  const handleGeneratePDF = useCallback(async (e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("Generate PDF for property:", propertyId);
    
    try {
      // Navigate to the PDF route
      window.open(`/property/${propertyId}/pdf`, '_blank', 'noopener,noreferrer');
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return false;
    }
  }, [propertyId]);

  const handleWebView = useCallback(async (e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("Opening WebView for property:", propertyId);
    
    try {
      // Open in a new tab with simplified URL structure
      const url = `/property/${propertyId}/webview`;
      console.log("Opening WebView URL:", url);
      
      // Fixed: Use window.location.origin to ensure full URL path
      window.open(`${window.location.origin}${url}`, '_blank', 'noopener,noreferrer');
      return true;
    } catch (error) {
      console.error("Error opening WebView:", error);
      return false;
    }
  }, [propertyId]);

  return {
    handleGeneratePDF,
    handleWebView,
    showWebView,
    setShowWebView
  };
}
