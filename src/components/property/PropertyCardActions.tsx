
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Edit, 
  Image, 
  MessageCircle
} from "lucide-react";
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

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click propagation
          navigate(`/property/${property.id}/dashboard`);
        }}
        title="Dashboard"
      >
        <LayoutDashboard className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click propagation
          navigate(`/property/${property.id}/content`);
        }}
        title="Edit Content"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click propagation
          navigate(`/property/${property.id}/media`);
        }}
        title="Media"
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click propagation
          navigate(`/property/${property.id}/communications`);
        }}
        className="relative"
        title="Communications"
      >
        <MessageCircle className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
}
