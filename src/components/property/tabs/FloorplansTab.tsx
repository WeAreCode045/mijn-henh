
import React from "react";
import { PropertyData, PropertyFloorplan, PropertyImage } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertToPropertyFloorplanArray } from "@/utils/propertyDataAdapters";

interface FloorplansTabProps {
  property: PropertyData;
  onRemoveFloorplan: (index: number) => void;
}

export function FloorplansTab({ property, onRemoveFloorplan }: FloorplansTabProps) {
  // Convert mixed floorplan types to PropertyFloorplan[]
  const floorplans = convertToPropertyFloorplanArray(property.floorplans || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Floorplans</CardTitle>
      </CardHeader>
      <CardContent>
        {floorplans.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No floorplans added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {floorplans.map((floorplan, index) => (
              <div key={floorplan.id || index} className="relative">
                <img
                  src={floorplan.url}
                  alt={`Floorplan ${index + 1}`}
                  className="rounded-md w-full h-auto"
                />
                <button
                  onClick={() => onRemoveFloorplan(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
