
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFloorplan, PropertyImage, PropertyTechnicalItem } from "@/types/property";
import { PlusCircle, Trash2, LayoutGrid } from "lucide-react";
import { useState } from "react";

interface TechnicalDataStepProps {
  technicalItems: PropertyTechnicalItem[];
  floorplans: PropertyFloorplan[];
  images: PropertyImage[];
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
}

export function TechnicalDataStep({
  technicalItems = [],
  floorplans = [],
  images = [],
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplan,
}: TechnicalDataStepProps) {
  const [activeFloorplanPreview, setActiveFloorplanPreview] = useState<number | null>(null);

  const handleAddTechnicalItem = () => {
    if (onAddTechnicalItem) onAddTechnicalItem();
  };

  const handleRemoveTechnicalItem = (id: string) => {
    if (onRemoveTechnicalItem) onRemoveTechnicalItem(id);
  };

  const handleUpdateTechnicalItem = (id: string, field: keyof PropertyTechnicalItem, value: any) => {
    if (onUpdateTechnicalItem) onUpdateTechnicalItem(id, field, value);
  };

  const handleFloorplanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFloorplanUpload) onFloorplanUpload(e);
  };

  const handleRemoveFloorplan = (index: number) => {
    if (onRemoveFloorplan) onRemoveFloorplan(index);
  };

  const handleUpdateFloorplan = (index: number, field: keyof PropertyFloorplan, value: any) => {
    if (onUpdateFloorplan) onUpdateFloorplan(index, field, value);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Technical Details</h3>
          <Button onClick={handleAddTechnicalItem} variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {technicalItems.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-md">
            <p className="text-gray-500">No technical items added yet.</p>
            <p className="text-gray-500 text-sm mt-1">
              Add items like room dimensions, construction materials, etc.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {technicalItems.map((item) => (
              <Card key={item.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveTechnicalItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`title-${item.id}`}>Title</Label>
                      <Input
                        id={`title-${item.id}`}
                        value={item.title}
                        onChange={(e) => handleUpdateTechnicalItem(item.id, "title", e.target.value)}
                        placeholder="e.g., Living Room, Kitchen"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`size-${item.id}`}>Size/Dimensions</Label>
                      <Input
                        id={`size-${item.id}`}
                        value={item.size}
                        onChange={(e) => handleUpdateTechnicalItem(item.id, "size", e.target.value)}
                        placeholder="e.g., 20m², 4x5m"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`floorplan-${item.id}`}>Floorplan</Label>
                      <div className="flex gap-2">
                        <select
                          id={`floorplan-${item.id}`}
                          value={item.floorplanId !== null ? item.floorplanId : ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : e.target.value;
                            handleUpdateTechnicalItem(item.id, "floorplanId", value);
                          }}
                          className="w-full rounded-md border border-input px-3 py-2"
                        >
                          <option value="">None</option>
                          {floorplans.map((floorplan, index) => (
                            <option key={index} value={index.toString()}>
                              Floorplan {index + 1}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (item.floorplanId !== null) {
                              setActiveFloorplanPreview(parseInt(item.floorplanId));
                            }
                          }}
                          disabled={item.floorplanId === null}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Columns selector for the floorplan when associated with a technical item */}
                    {item.floorplanId !== null && (
                      <div>
                        <Label htmlFor={`columns-${item.id}`}>Display Columns</Label>
                        <select
                          id={`columns-${item.id}`}
                          value={item.columns || 1}
                          onChange={(e) => handleUpdateTechnicalItem(item.id, "columns", parseInt(e.target.value))}
                          className="w-full rounded-md border border-input px-3 py-2"
                        >
                          <option value={1}>1 Column</option>
                          <option value={2}>2 Columns</option>
                          <option value={3}>3 Columns</option>
                          <option value={4}>4 Columns</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="md:col-span-3">
                      <Label htmlFor={`description-${item.id}`}>Description</Label>
                      <Textarea
                        id={`description-${item.id}`}
                        value={item.description}
                        onChange={(e) => handleUpdateTechnicalItem(item.id, "description", e.target.value)}
                        placeholder="Additional details about this area"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Floorplans</h3>
          <Button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.accept = "image/*";
              input.onchange = handleFloorplanUpload;
              input.click();
            }}
            variant="outline"
            size="sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Floorplans
          </Button>
        </div>

        {floorplans.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-md">
            <p className="text-gray-500">No floorplans uploaded yet.</p>
            <p className="text-gray-500 text-sm mt-1">Upload floorplans to link them to technical items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {floorplans.map((floorplan, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={floorplan.url}
                    alt={`Floorplan ${index + 1}`}
                    className="w-full h-40 object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveFloorplan(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <div className="text-sm font-medium">Floorplan {index + 1}</div>
                  <div className="mt-2">
                    <Label htmlFor={`floorplan-columns-${index}`} className="text-xs">
                      Default Display Columns
                    </Label>
                    <select
                      id={`floorplan-columns-${index}`}
                      value={floorplan.columns || 1}
                      onChange={(e) => handleUpdateFloorplan(index, "columns", parseInt(e.target.value))}
                      className="w-full text-sm rounded-md border border-input px-2 py-1 mt-1"
                    >
                      <option value={1}>1 Column</option>
                      <option value={2}>2 Columns</option>
                      <option value={3}>3 Columns</option>
                      <option value={4}>4 Columns</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {activeFloorplanPreview !== null && floorplans[activeFloorplanPreview] && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Floorplan Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveFloorplanPreview(null)}>
                Close
              </Button>
            </div>
            <img
              src={floorplans[activeFloorplanPreview].url}
              alt="Floorplan preview"
              className="max-w-full max-h-[70vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
