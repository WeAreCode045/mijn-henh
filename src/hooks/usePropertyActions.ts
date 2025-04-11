
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function usePropertyActions(propertyId: string) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGeneratePDF = useCallback(async (e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("usePropertyActions - Generate PDF for property:", propertyId);
    
    try {
      // Navigate to the PDF route in a new tab
      const url = `/property/${propertyId}/pdf`;
      console.log("Opening PDF URL:", url);
      window.open(url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "PDF Generation",
        description: "Opening PDF generator in a new tab",
      });
      
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
      
      return false;
    }
  }, [propertyId, toast]);

  const handleWebView = useCallback(async (e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("usePropertyActions - Opening WebView for property:", propertyId);
    
    try {
      // Get full URL including origin to avoid issues with relative paths
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/property/${propertyId}/webview`;
      console.log("Opening WebView URL:", url);
      
      // Open in a new tab and return the window object for testing
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Web View",
        description: "Opening web view in a new tab",
      });
      
      return !!newWindow;
    } catch (error) {
      console.error("Error opening WebView:", error);
      
      toast({
        title: "Error",
        description: "Failed to open web view",
        variant: "destructive",
      });
      
      return false;
    }
  }, [propertyId, toast]);

  return {
    handleGeneratePDF,
    handleWebView
  };
}
