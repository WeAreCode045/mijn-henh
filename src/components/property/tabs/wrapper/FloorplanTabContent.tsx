import { PropertyFloorplanTab } from "../PropertyFloorplanTab";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanTabContentProps {
  id: string;
  title: string;
  Floorplan: PropertyFloorplan[];
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
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploading,
  onUpload,
}: FloorplanTabContentProps) {
  // Use aliases if provided, fall back to original props
  const effectiveFloorplanUpload = onUpload || onFloorplanUpload;

  return (
    <PropertyFloorplanTab
      id={id}
      title={title}
      Floorplan={Floorplan}
      onFloorplanUpload={effectiveFloorplanUpload}
      onRemoveFloorplan={onRemoveFloorplan}
      isUploading={isUploading}
      />
  );
}
