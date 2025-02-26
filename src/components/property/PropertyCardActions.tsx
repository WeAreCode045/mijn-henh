
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowUpRight, 
  Pencil, 
  Trash, 
  Bell,
  FileDown
} from "lucide-react";
import { generatePropertyPDF } from "@/utils/pdfGenerator";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

interface PropertyCardActionsProps {
  property: PropertyData;
  settings: AgencySettings;
  onDelete: (id: string) => void;
  unreadCount: number;
  onShowSubmissions: () => void;
}

export const PropertyCardActions = ({
  property,
  settings,
  onDelete,
  unreadCount,
  onShowSubmissions
}: PropertyCardActionsProps) => {
  const navigate = useNavigate();

  const handleDownloadPDF = async () => {
    await generatePropertyPDF(property, settings);
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => navigate(`/property/${property.id}/webview`)}
        title="Open Preview"
      >
        <ArrowUpRight className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => navigate(`/property/${property.id}/edit`)}
        title="Bewerk"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleDownloadPDF}
        title="Download PDF"
      >
        <FileDown className="h-4 w-4" />
      </Button>
      <Button 
        variant="destructive" 
        size="icon"
        onClick={() => onDelete(property.id)}
        title="Verwijder"
      >
        <Trash className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onShowSubmissions}
        className="relative"
        title="Berichten"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
};
