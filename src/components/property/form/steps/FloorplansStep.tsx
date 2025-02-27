
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload } from "lucide-react";
import { PropertyFloorplan } from "@/types/property";

interface FloorplansStepProps {
  floorplans: PropertyFloorplan[];
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan: (index: number) => void;
  onUpdateFloorplan: (index: number, field: keyof PropertyFloorplan, value: any) => void;
}

export function FloorplansStep({
  floorplans,
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplan
}: FloorplansStepProps) {
  const [uploadKey, setUploadKey] = useState(Date.now());

  // Reset the upload field after a successful upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFloorplanUpload(e);
    setUploadKey(Date.now()); // Reset the input key to clear the field
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-estate-800">Floorplans</h2>
        <p className="text-sm text-estate-600">
          Upload floorplan images to showcase your property's layout
        </p>
      </div>

      <div className="border p-4 rounded-md bg-slate-50">
        <Label htmlFor="floorplans" className="block mb-2">
          Upload Floorplans
        </Label>
        <Input
          type="file"
          id="floorplans"
          key={uploadKey}
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="mb-4"
        />
        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, WebP. Maximum size: 10MB per file.
        </p>
      </div>

      {floorplans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Floorplans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {floorplans.map((floorplan, index) => (
              <div key={index} className="relative border rounded-md p-3 bg-white">
                <div className="flex flex-col space-y-3">
                  <div className="relative aspect-video">
                    <img 
                      src={floorplan.url} 
                      alt={`Floorplan ${index + 1}`} 
                      className="w-full h-full object-contain rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => onRemoveFloorplan(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="flex-shrink-0">Columns:</Label>
                    <Select
                      value={String(floorplan.columns || 1)}
                      onValueChange={(value) => onUpdateFloorplan(index, 'columns', parseInt(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Columns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
