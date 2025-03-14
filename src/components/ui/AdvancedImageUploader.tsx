
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus } from "lucide-react";

interface AdvancedImageUploaderProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
  label?: string;
  multiple?: boolean;
}

export function AdvancedImageUploader({
  onUpload,
  isUploading = false,
  label = "Upload Images",
  multiple = true
}: AdvancedImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event to pass to the onUpload handler
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onUpload(syntheticEvent);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging 
            ? "border-primary bg-primary/10" 
            : "border-muted-foreground/20 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            {isUploading ? "Uploading..." : "SVG, PNG, JPG or GIF"}
          </p>
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-4"
            disabled={isUploading}
            onClick={handleButtonClick}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : label}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onUpload}
        disabled={isUploading}
        className="hidden"
        multiple={multiple}
      />
    </div>
  );
}
