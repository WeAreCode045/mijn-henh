
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MapPreviewSectionProps {
  formData: PropertyFormData;
  onDeleteMapImage?: () => Promise<void>;
}

export function MapPreviewSection({ formData, onDeleteMapImage }: MapPreviewSectionProps) {
  const hasMapImage = !!formData.map_image;
  const hasCoordinates = formData.latitude && formData.longitude;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Map Preview</h3>
      
      {hasMapImage ? (
        <div className="relative">
          <img 
            src={formData.map_image} 
            alt="Map preview" 
            className="w-full h-auto rounded-md"
          />
          {onDeleteMapImage && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={onDeleteMapImage}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove Map
            </Button>
          )}
        </div>
      ) : hasCoordinates ? (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              Coordinates available, but no map image generated yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              No map image or coordinates available. Add an address and fetch location data to generate a map.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
