
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useState, useEffect, createRef } from "react";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { FloorplanDatabaseFetcher } from "./floorplans/FloorplanDatabaseFetcher";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanCardProps {
  id?: string;
  floorplans?: any[];
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  isUploading?: boolean;
}

export function FloorplansCard({
  id,
  floorplans = [],
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploading = false,
}: FloorplanCardProps) {
  const [uploading, setUploading] = useState(isUploading);
  const [displayFloorplans, setDisplayFloorplans] = useState<PropertyFloorplan[]>(
    Array.isArray(floorplans) ? floorplans : []
  );
  const fileInputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    setUploading(isUploading);
  }, [isUploading]);

  useEffect(() => {
    if (floorplans && floorplans.length > 0) {
      setDisplayFloorplans(floorplans);
    }
  }, [floorplans]);

  const handleFloorplanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (onFloorplanUpload) {
      onFloorplanUpload(e);
    }
    // Reset the file input value
    e.target.value = '';
  };

  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Helper function to get the URL from a floorplan object
  const getFloorplanUrl = (floorplan: any): string => {
    if (typeof floorplan === 'string') return floorplan;
    if (floorplan && typeof floorplan === 'object' && 'url' in floorplan) return floorplan.url;
    return '';
  };

  const handleFetchComplete = (fetchedFloorplans: PropertyFloorplan[]) => {
    if (fetchedFloorplans.length > 0) {
      setDisplayFloorplans(fetchedFloorplans);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Floorplans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden database fetcher component */}
        {id && (
          <FloorplanDatabaseFetcher
            propertyId={id}
            floorplans={displayFloorplans}
            onFetchComplete={handleFetchComplete}
          />
        )}

        <div className="flex flex-col space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            onClick={handleUploadClick}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Floorplans"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFloorplanUpload}
            disabled={uploading}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {displayFloorplans && displayFloorplans.length > 0 ? (
              displayFloorplans.map((floorplan, index) => {
                const url = getFloorplanUrl(floorplan);
                const label = floorplan.title || `Floorplan ${index + 1}`;
                
                return (
                  <ImagePreview
                    key={floorplan.id || index}
                    url={url}
                    onRemove={() => onRemoveFloorplan && onRemoveFloorplan(index)}
                    label={label}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                No floorplans uploaded yet. Click "Upload Floorplans" to add floorplans.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
