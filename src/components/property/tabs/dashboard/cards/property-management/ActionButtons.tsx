
import { Button } from "@/components/ui/button";
import { FileText, MonitorSmartphone } from "lucide-react";

interface ActionButtonsProps {
  onGeneratePDF: (e: React.MouseEvent) => void;
  onWebView: (e: React.MouseEvent) => void;
  isArchived?: boolean;
}

export function ActionButtons({ onGeneratePDF, onWebView, isArchived = false }: ActionButtonsProps) {
  const handlePDFClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Generate PDF button clicked");
    onGeneratePDF(e);
  };
  
  const handleWebViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Web View button clicked");
    // Directly call the parent handler to trigger the webview
    onWebView(e);
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handlePDFClick}
        variant="outline" 
        className="w-full justify-start" 
        disabled={isArchived}
      >
        <FileText className="mr-2 h-4 w-4" />
        Generate PDF
      </Button>
      
      <Button 
        onClick={handleWebViewClick}
        variant="outline" 
        className="w-full justify-start" 
        disabled={isArchived}
      >
        <MonitorSmartphone className="mr-2 h-4 w-4" />
        Web View
      </Button>
    </div>
  );
}
