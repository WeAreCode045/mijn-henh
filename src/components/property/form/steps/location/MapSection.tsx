
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

interface MapSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  hideControls?: boolean;
}

export function MapSection({
  formData,
  onFieldChange,
  onFetchLocationData,
  onGenerateMap,
  isLoadingLocationData = false,
  isGeneratingMap = false,
  setPendingChanges,
  hideControls = false
}: MapSectionProps) {
  const hasCoordinates = formData.latitude && formData.longitude;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {formData.map_image ? (
          <div className="relative">
            <img 
              src={formData.map_image} 
              alt="Property map" 
              className="w-full h-auto rounded-md"
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        {!hideControls && (
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isLoadingLocationData || !formData.address}
              onClick={onFetchLocationData}
            >
              {isLoadingLocationData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Get Coordinates'
              )}
            </Button>
            
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isGeneratingMap || !hasCoordinates}
              onClick={onGenerateMap}
            >
              {isGeneratingMap ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Map'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
