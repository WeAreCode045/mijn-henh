
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MapPreviewSectionProps {
  formData: PropertyFormData;
  handleMapImageDelete?: () => Promise<void>;
}

export function MapPreviewSection({
  formData,
  handleMapImageDelete
}: MapPreviewSectionProps) {
  if (!formData.map_image) return null;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Map Preview</Label>
            {handleMapImageDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault();
                  handleMapImageDelete();
                }}
                className="flex items-center gap-1"
                type="button"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </Button>
            )}
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <img
              src={formData.map_image}
              alt="Property location map"
              className="w-full h-auto"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
