
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

interface ActionButtonsProps {
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  isArchived?: boolean;
}

export function ActionButtons({ onGeneratePDF, onWebView, isArchived = false }: ActionButtonsProps) {
  // Simple wrapper functions that log the action and call the parent handler
  const handlePDFClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Generate PDF button clicked - calling parent handler");
    onGeneratePDF(e);
  };
  
  const handleWebViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Web View button clicked - calling parent handler");
    onWebView(e);
  };

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
