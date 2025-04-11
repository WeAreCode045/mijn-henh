
import { useState } from "react";
import { PropertyData } from "@/types/property";
import { useAgencySettings } from "./useAgencySettings";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useGeneratePDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { settings } = useAgencySettings();
  const { toast } = useToast();
  
  const generatePDF = async (property: PropertyData) => {
    if (!property || !property.id) {
      console.error("Cannot generate PDF - property data is missing");
      toast({
        title: "Error",
        description: "Cannot generate PDF - property data is missing",
        variant: "destructive"
      });
      return null;
    }
    
    console.log("Generating PDF for property:", property.id);
    setIsGenerating(true);
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your PDF...",
      });
      
      console.log("Calling Supabase Edge Function: generate-brochure");
      const { data, error } = await supabase.functions.invoke('generate-brochure', {
        body: { propertyId: property.id }
      });
      
      if (error) {
        console.error("Error generating PDF:", error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
      }
      
      if (!data || !data.pdf) {
        console.error("No PDF data returned");
        throw new Error("No PDF data returned from server");
      }
      
      console.log("PDF generated successfully, opening in new window");
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
      
      // Open PDF in new tab with improved reliability
      const pdfDataUri = data.pdf;
      const pdfWindow = window.open('', '_blank');
      
      if (pdfWindow) {
        pdfWindow.document.write(`
          <html>
            <head>
              <title>${property.title || 'Property'} - PDF</title>
              <style>
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
                embed { width: 100%; height: 100%; display: block; }
              </style>
            </head>
            <body>
              <embed src="${pdfDataUri}" type="application/pdf" />
            </body>
          </html>
        `);
        pdfWindow.document.close();
      } else {
        // Fallback for popup blockers
        console.log("PDF window was blocked, creating direct download link");
        
        // Create temporary link for download
        const link = document.createElement('a');
        link.href = pdfDataUri;
        link.download = `${property.title || 'property'}-brochure.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "PDF Download",
          description: "Downloading PDF (popup was blocked)",
        });
      }
      
      return pdfDataUri;
    } catch (error: any) {
      console.error("Error in generatePDF:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return { generatePDF, isGenerating };
}
