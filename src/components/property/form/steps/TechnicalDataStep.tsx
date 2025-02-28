
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFloorplan } from "@/types/property";
import { Plus, Trash, ImagePlus } from "lucide-react";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import { Textarea } from "@/components/ui/textarea";

interface TechnicalItem {
  id: string;
  title: string;
  size: string;
  description: string;
  floorplanId: string | null;
}

interface TechnicalDataStepProps {
  floorplans: PropertyFloorplan[];
  technicalItems?: TechnicalItem[];
  images?: any[];
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: any, value: any) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: string, value: any) => void;
}

export function TechnicalDataStep({
  floorplans = [],
  technicalItems = [],
  images = [],
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplan,
  onAddTechnicalItem = () => console.log("Add technical item"),
  onRemoveTechnicalItem = (id) => console.log("Remove technical item", id),
  onUpdateTechnicalItem = (id, field, value) => console.log("Update technical item", id, field, value)
}: TechnicalDataStepProps) {
  const [uploadKey, setUploadKey] = useState(Date.now());

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFloorplanUpload(e);
    setUploadKey(Date.now()); // Reset the input key to clear the field
  };

  const handleAddItem = () => {
    onAddTechnicalItem();
  };

  const handleFloorplanSelect = (id: string, floorplanId: string) => {
    onUpdateTechnicalItem(id, 'floorplanId', floorplanId);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-estate-800">Technical Data</h2>
        <p className="text-sm text-estate-600">
          Add technical details about rooms and areas with floorplans
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
          <div className="grid grid-cols-5 gap-4">
            {floorplans.map((floorplan, index) => (
              <div key={index} className="relative border rounded-md overflow-hidden group">
                <img 
                  src={floorplan.url} 
                  alt={`Floorplan ${index + 1}`} 
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200"></div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveFloorplan(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Technical Items</h3>
          <Button variant="outline" size="sm" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {technicalItems.length === 0 && (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground text-center">No technical items added yet.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          )}

          {technicalItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    <Input
                      placeholder="Item Title"
                      value={item.title}
                      onChange={(e) => onUpdateTechnicalItem(item.id, 'title', e.target.value)}
                      className="border-0 p-0 text-lg font-semibold focus-visible:ring-0"
                    />
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveTechnicalItem(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`size-${item.id}`} className="text-sm">Size (sqm)</Label>
                    <Input
                      id={`size-${item.id}`}
                      placeholder="Size in square meters"
                      value={item.size}
                      onChange={(e) => onUpdateTechnicalItem(item.id, 'size', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`description-${item.id}`} className="text-sm">Description</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => onUpdateTechnicalItem(item.id, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {item.floorplanId ? (
                  <div className="w-full">
                    <div className="mb-2 flex justify-between items-center">
                      <Label className="text-sm">Selected Floorplan</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFloorplanSelect(item.id, '')}
                        className="h-6 text-xs text-muted-foreground"
                      >
                        Change
                      </Button>
                    </div>
                    <div className="border rounded-md overflow-hidden w-full h-40">
                      {floorplans.map((floorplan, index) => {
                        if (index.toString() === item.floorplanId) {
                          return (
                            <img 
                              key={index}
                              src={floorplan.url} 
                              alt="Selected floorplan" 
                              className="w-full h-full object-contain"
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ) : (
                  <Card className="flex items-center justify-center w-full h-28 border-dashed cursor-pointer hover:bg-slate-50 transition-colors">
                    <div 
                      className="flex flex-col items-center p-4"
                      onClick={() => {
                        if (floorplans.length > 0) {
                          handleFloorplanSelect(item.id, '0');
                        }
                      }}
                    >
                      <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Select Floorplan</span>
                    </div>
                  </Card>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
