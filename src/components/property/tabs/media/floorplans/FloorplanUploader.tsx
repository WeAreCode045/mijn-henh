
import React from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

interface FloorplanUploaderProps {
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function FloorplanUploader({ onFloorplanUpload, isUploading }: FloorplanUploaderProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md">
      <p className="text-muted-foreground mb-4">Upload floorplan images</p>
      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={onFloorplanUpload}
          disabled={isUploading}
        />
        <Button variant="secondary" disabled={isUploading}>
          <UploadIcon className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Floorplans"}
        </Button>
      </label>
    </div>
  );
}
