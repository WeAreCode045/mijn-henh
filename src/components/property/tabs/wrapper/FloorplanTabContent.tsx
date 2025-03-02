
import { PropertyFloorplanTab } from "../PropertyFloorplanTab";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanTabContentProps {
  id: string;
  title: string;
  Floorplan?: PropertyFloorplan[];
  floorplans?: PropertyFloorplan[];
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan: (index: number) => void;
  isUploading?: boolean;
  // Add onUpload as an alias for onFloorplanUpload
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FloorplanTabContent({
  id,
  title,
  Floorplan,
  floorplans,
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploading,
  onUpload,
}: FloorplanTabContentProps) {
  // Use aliases if provided, fall back to original props
  const effectiveFloorplanUpload = onUpload || onFloorplanUpload;
  const effectiveFloorplans = floorplans || Floorplan || [];
  
  console.log("FloorplanTabContent - Rendering with floorplans:", effectiveFloorplans);

  return (
    <PropertyFloorplanTab
      id={id}
      title={title}
      floorplans={effectiveFloorplans}
      Floorplan={effectiveFloorplans}
      onFloorplanUpload={effectiveFloorplanUpload}
      onRemoveFloorplan={onRemoveFloorplan}
      isUploading={isUploading}
    />
  );
}
