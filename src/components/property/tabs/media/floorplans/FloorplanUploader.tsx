
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface FloorplanUploaderProps {
  isLoading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FloorplanUploader({ isLoading, onUpload }: FloorplanUploaderProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        disabled={isLoading}
        onClick={(e) => {
          e.preventDefault(); // Prevent any default navigation
          document.getElementById('floorplan-upload')?.click();
        }}
      >
        {isLoading ? (
          <>
            <Spinner className="h-4 w-4 mr-2" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            <span>Upload Floorplans</span>
          </>
        )}
      </Button>
      <input
        id="floorplan-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onUpload}
        disabled={isLoading}
      />
    </div>
  );
}
