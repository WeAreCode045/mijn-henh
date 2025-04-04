
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
  onShowWebView: () => void;
}

export function PropertyActions({ propertyId, onGeneratePDF, onShowWebView }: PropertyActionsProps) {
  const navigate = useNavigate();
  
  const handleGeneratePDF = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PropertyActions - Generate PDF button clicked");
    if (typeof onGeneratePDF === 'function') {
      onGeneratePDF();
    } else {
      console.error("onGeneratePDF is not a function");
    }
  };
  
  const handleWebView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PropertyActions - Web View button clicked");
    if (typeof onShowWebView === 'function') {
      onShowWebView();
    } else {
      console.error("onShowWebView is not a function");
    }
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
        onClick={handleWebView}
        className="flex items-center gap-1"
      >
        <ArrowUpRight className="h-4 w-4" />
        <span>View</span>
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={handleGeneratePDF}
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
