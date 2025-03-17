
import { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AreaImageActions } from "./area/AreaImageActions";

interface PropertyAreaImageUploadProps {
  areaId: string;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading?: boolean;
}

export function PropertyAreaImageUpload({
  areaId,
  onUpload,
  isUploading = false
}: PropertyAreaImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={onUpload}
        disabled={isUploading}
        data-area-id={areaId}
      />
      
      <AreaImageActions onSelectClick={handleSelectClick} />
      
      {isUploading && (
        <div className="mt-2 text-sm text-muted-foreground">
          Uploading images...
        </div>
      )}
    </div>
  );
}
