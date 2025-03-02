
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanCardProps {
  floorplans: PropertyFloorplan[];
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorplanRemove: (index: number) => void;
  onFloorplanUpdate?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
  isUploading?: boolean; // Added isUploading property
}

export function PropertyFloorplanCard({
  floorplans = [],
  onFloorplanUpload,
  onFloorplanRemove,
  onFloorplanUpdate,
  isUploading = false // Added with default value
}: FloorplanCardProps) {
  console.log("PropertyFloorplanCard - Received floorplans:", floorplans);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Floorplans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('floorplan-upload')?.click()}
              disabled={isUploading} // Use isUploading to disable button when uploading
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload Floorplan'}
            </Button>
            <input
              id="floorplan-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onFloorplanUpload}
              disabled={isUploading} // Use isUploading to disable input when uploading
            />
          </div>
          
          {floorplans.length === 0 ? (
            <p className="text-muted-foreground">No floorplans uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {floorplans.map((floorplan, index) => (
                <div key={floorplan.id || index} className="relative group">
                  <img 
                    src={floorplan.url} 
                    alt={`Floorplan ${index + 1}`} 
                    className="w-full h-auto object-cover rounded-md border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onFloorplanRemove(index)}
                      className="text-white"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
