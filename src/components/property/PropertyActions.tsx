
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Edit, 
  ArrowUpRight, 
  FileText,
  MessageSquare
} from "lucide-react";

interface PropertyActionsProps {
  propertyId: string;
  onGeneratePDF: () => void;
  onShowWebView: (e?: React.MouseEvent) => void;
}

export function PropertyActions({ propertyId, onGeneratePDF, onShowWebView }: PropertyActionsProps) {
  const navigate = useNavigate();
  
  const handleWebViewClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Stop event propagation
    onShowWebView(e);
  };
  
  const handlePdfClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Stop event propagation
    onGeneratePDF();
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline"
        size="sm"
        onClick={() => navigate(`/property/${propertyId}/dashboard`)}
        className="flex items-center gap-1"
      >
        <Edit className="h-4 w-4" />
        <span>Edit</span>
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={handleWebViewClick}
        className="flex items-center gap-1"
      >
        <ArrowUpRight className="h-4 w-4" />
        <span>View</span>
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={handlePdfClick}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        <span>PDF</span>
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={() => navigate(`/property/${propertyId}/communications`)}
        className="flex items-center gap-1"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Messages</span>
      </Button>
    </div>
  );
}
