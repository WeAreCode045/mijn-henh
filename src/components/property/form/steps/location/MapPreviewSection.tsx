
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Map } from "lucide-react";

interface MapPreviewSectionProps {
  formData: PropertyFormData;
  onDeleteMapImage?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  isGeneratingMap?: boolean;
}

export function MapPreviewSection({ 
  formData,
  onDeleteMapImage,
  onGenerateMap,
  isGeneratingMap = false
}: MapPreviewSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Map Preview</Label>
        {onGenerateMap && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onGenerateMap();
            }}
            disabled={isGeneratingMap || !formData.address}
            type="button"
            className="flex gap-1 items-center"
          >
            {isGeneratingMap ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Map...
              </>
            ) : (
              <>
                <Map className="h-4 w-4" />
                Generate Map
              </>
            )}
          </Button>
        )}
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
          <p className="text-sm mt-1">Generate a map image using the button above.</p>
        </div>
      )}
    </div>
  );
}
