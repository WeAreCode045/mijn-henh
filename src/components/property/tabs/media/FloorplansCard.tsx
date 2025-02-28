
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { PropertyFloorplan } from "@/types/property";
import { Label } from "@/components/ui/label";

interface FloorplansCardProps {
  floorplans: PropertyFloorplan[];
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorplanRemove: (index: number) => void;
  onFloorplanUpdate?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
}

export function FloorplansCard({
  floorplans = [],
  onFloorplanUpload,
  onFloorplanRemove,
  onFloorplanUpdate
}: FloorplansCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Floorplans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Floorplans ({floorplans.length})</h3>
            
            {floorplans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {floorplans.map((floorplan, index) => (
                  <div key={index} className="relative border rounded-md p-3">
                    <img
                      src={floorplan.url}
                      alt={`Floorplan ${index + 1}`}
                      className="w-full h-40 object-contain"
                    />
                    
                    {onFloorplanUpdate && (
                      <div className="mt-2">
                        <Label htmlFor={`columns-${index}`}>Display Columns</Label>
                        <select
                          id={`columns-${index}`}
                          value={floorplan.columns || 1}
                          onChange={(e) => onFloorplanUpdate(index, 'columns', parseInt(e.target.value))}
                          className="block w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                        >
                          <option value={1}>1 Column</option>
                          <option value={2}>2 Columns</option>
                          <option value={3}>3 Columns</option>
                          <option value={4}>4 Columns</option>
                        </select>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => onFloorplanRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md text-gray-500">
                <p>No floorplans have been added yet</p>
              </div>
            )}
          </div>
          
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = "image/*";
                input.onchange = (e) => {
                  // Type assertion to safely convert Event to React.ChangeEvent<HTMLInputElement>
                  if (e && e.target) {
                    onFloorplanUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
                  }
                };
                input.click();
              }}
            >
              Upload Floorplans
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
