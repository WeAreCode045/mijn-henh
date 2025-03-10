
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { FloorplanDatabaseFetcher } from "./floorplans/FloorplanDatabaseFetcher";
import { PropertyFloorplan } from "@/types/property";
import { FloorplanUploader } from "./floorplans/FloorplanUploader";
import { SortableFloorplanGrid } from "./floorplans/SortableFloorplanGrid";
import { useSortableFloorplans } from "@/hooks/images/useSortableFloorplans";

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

  // Use our custom hook for drag and drop functionality
  const { sortableFloorplans, handleDragEnd } = useSortableFloorplans(displayFloorplans, id);

  useEffect(() => {
    setUploading(isUploading);
  }, [isUploading]);

  useEffect(() => {
    if (floorplans && floorplans.length > 0) {
      // Sort floorplans by sort_order when they come in
      const sortedFloorplans = [...floorplans].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      setDisplayFloorplans(sortedFloorplans);
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

  const handleFetchComplete = (fetchedFloorplans: PropertyFloorplan[]) => {
    if (fetchedFloorplans.length > 0) {
      // Ensure floorplans are sorted by sort_order
      const sortedFloorplans = [...fetchedFloorplans].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      setDisplayFloorplans(sortedFloorplans);
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
          <FloorplanUploader 
            onFloorplanUpload={handleFloorplanUpload}
            isUploading={uploading}
          />
          
          <div className="w-full">
            <SortableFloorplanGrid 
              floorplans={sortableFloorplans}
              onRemoveFloorplan={onRemoveFloorplan || (() => {})}
              onDragEnd={handleDragEnd}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
