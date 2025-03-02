
import { PropertyFloorplan } from "@/types/property";
import { PropertyFloorplanCard } from "./floorplans/PropertyFloorplanCard";

interface PropertyFloorplanTabProps {
  id: string;
  title: string;
  Floorplan?: PropertyFloorplan[];
  floorplans?: PropertyFloorplan[];
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (index: number) => void;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan: (index: number) => void;
  isUploading?: boolean; // Added this missing property to fix the TypeScript error
}

export function PropertyFloorplanTab({
  id,
  title,
  Floorplan,
  floorplans,
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploading, // Added this parameter to the component
}: PropertyFloorplanTabProps) {
  // Use either Floorplan or floorplans prop, defaulting to an empty array
  const floorplansData = floorplans || Floorplan || [];
  
  console.log("PropertyFloorplanTab - Rendering with floorplans:", floorplansData);
  
  return (
    <div className="space-y-6">
      <PropertyFloorplanCard 
        floorplans={floorplansData}
        onFloorplanUpload={onFloorplanUpload}
        onFloorplanRemove={onRemoveFloorplan}
        isUploading={isUploading} // Pass the isUploading prop to the PropertyFloorplanCard
      />
    </div>
  );
}
