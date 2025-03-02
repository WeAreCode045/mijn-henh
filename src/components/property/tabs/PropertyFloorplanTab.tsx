
import { PropertyFloorplan } from "@/types/property";
import { PropertyFloorplanCard } from "./floorplans/PropertyFloorplanCard";

interface PropertyFloorplanTabProps {
  id: string;
  title: string;
  Floorplan: PropertyFloorplan[];
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (index: number) => void;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan: (index: number) => void;
}

export function PropertyFloorplanTab({
  onFloorplanUpload,
  onRemoveFloorplan,
}: PropertyFloorplanTabProps) {
  return (
    <div className="space-y-6">
      <PropertyFloorplanCard 
        Floorplan={Floorplan}
        onFloorplanUpload={onFloorplanUpload}
        onRemoveFloorplan={onRemoveFloorplan}
      />
    </div>
  );
}
