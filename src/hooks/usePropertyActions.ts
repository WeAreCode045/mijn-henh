
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function usePropertyActions(propertyId: string) {
  const { toast } = useToast();
  const [isWebViewOpen, setIsWebViewOpen] = useState(false);

  const handleGeneratePDF = useCallback((e?: React.MouseEvent) => {
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
      
      // Ensure we use window.open correctly
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // Check if window was opened successfully
      if (!newWindow) {
        throw new Error("Unable to open new window, possibly blocked by popup blocker");
      }
      
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

  const handleWebView = useCallback((e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("usePropertyActions - Opening WebView for property:", propertyId);
    
    try {
      // Open in a new tab instead of dialog
      const url = `/property/${propertyId}/webview`;
      console.log("Opening WebView URL:", url);
      
      // Ensure we use window.open correctly
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // Check if window was opened successfully
      if (!newWindow) {
        throw new Error("Unable to open new window, possibly blocked by popup blocker");
      }
      
      toast({
        title: "Web View",
        description: "Opening web view in a new tab",
      });
      
      return true;
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
    handleWebView,
    isWebViewOpen,
    setIsWebViewOpen
  };
}
