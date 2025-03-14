
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface MapPreviewSectionProps {
  formData: PropertyFormData;
  onDeleteMapImage?: () => Promise<void>;
}

export function MapPreviewSection({ 
  formData,
  onDeleteMapImage 
}: MapPreviewSectionProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const navigateToMediaTab = () => {
    // Use the id from the form data or from the URL params
    const propertyId = formData.id || id;
    if (propertyId) {
      navigate(`/property/${propertyId}/media`);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Map Preview</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToMediaTab}
          type="button"
          className="flex gap-1 items-center"
        >
          <PencilIcon className="h-4 w-4" />
          Edit in Media Tab
        </Button>
      </div>
      
      {formData.map_image ? (
        <div className="relative rounded-md overflow-hidden border">
          <img 
            src={formData.map_image} 
            alt="Map preview" 
            className="w-full h-auto"
          />
        </div>
      ) : (
        <div className="bg-gray-100 border rounded-md p-8 text-center text-gray-500">
          <p>No map image available.</p>
          <p className="text-sm mt-1">Upload a map image in the Media tab.</p>
        </div>
      )}
    </div>
  );
}
