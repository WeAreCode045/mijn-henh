
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { useCallback } from "react";

interface ActionButtonsProps {
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  isArchived?: boolean;
  propertyId: string;
}

export function ActionButtons({ 
  onGeneratePDF, 
  onWebView, 
  isArchived = false,
  propertyId
}: ActionButtonsProps) {
  // Create standalone handlers that won't be affected by other components
  const handlePDFClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`ActionButtons: Generate PDF button clicked for property ${propertyId}`);
    onGeneratePDF(e);
  }, [onGeneratePDF, propertyId]);
  
  const handleWebViewClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`ActionButtons: Web View button clicked for property ${propertyId}`);
    onWebView(e);
  }, [onWebView, propertyId]);

  return (
    <div className="space-y-2">
      <Button 
        onClick={handlePDFClick}
        variant="outline" 
        className="w-full justify-start" 
        disabled={isArchived}
        type="button"
      >
        <FileText className="mr-2 h-4 w-4" />
        Generate PDF
      </Button>
      
      <Button 
        onClick={handleWebViewClick}
        variant="outline" 
        className="w-full justify-start" 
        disabled={isArchived}
        type="button"
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Web View
      </Button>
    </div>
  );
}
