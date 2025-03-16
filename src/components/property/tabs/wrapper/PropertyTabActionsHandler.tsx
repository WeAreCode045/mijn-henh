
import { useState } from "react";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { useToast } from "@/components/ui/use-toast";

interface PropertyTabActionsHandlerProps {
  propertyId: string;
  children: (props: {
    webViewOpen: boolean;
    setWebViewOpen: (open: boolean) => void;
    handleGeneratePDF: () => void;
    handleOpenWebView: () => void;
  }) => React.ReactNode;
}

export function PropertyTabActionsHandler({ propertyId, children }: PropertyTabActionsHandlerProps) {
  const [webViewOpen, setWebViewOpen] = useState(false);
  const { generatePDF, isGenerating } = usePDFGenerator();
  const { toast } = useToast();

  const handleGeneratePDF = () => {
    toast({
      title: "PDF Generation",
      description: "PDF generation is coming soon!"
    });
  };

  const handleOpenWebView = () => {
    setWebViewOpen(true);
  };

  return children({
    webViewOpen,
    setWebViewOpen,
    handleGeneratePDF,
    handleOpenWebView
  });
}
