
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";

interface PropertyTabActionsHandlerProps {
  propertyId: string;
  baseRoute?: string;
  children: (props: {
    webViewOpen: boolean;
    setWebViewOpen: (open: boolean) => void;
    handleGeneratePDF: () => void;
    handleOpenWebView: () => void;
  }) => React.ReactNode;
}

export function PropertyTabActionsHandler({
  propertyId,
  baseRoute = "/properties",
  children,
}: PropertyTabActionsHandlerProps) {
  const [webViewOpen, setWebViewOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generatePDF, isGenerating } = usePDFGenerator();

  const handlePDFGenerate = async () => {
    try {
      // Use default options if no specific options provided
      await generatePDF(propertyId);
      
      toast({
        title: "PDF Generated",
        description: "PDF has been generated successfully"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handleWebViewOpen = () => {
    setWebViewOpen(true);
  };

  return children({
    webViewOpen,
    setWebViewOpen,
    handleGeneratePDF: handlePDFGenerate,
    handleOpenWebView: handleWebViewOpen,
  });
}
