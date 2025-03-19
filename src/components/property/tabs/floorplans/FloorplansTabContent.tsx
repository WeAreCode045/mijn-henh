
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FloorplansTabContentProps {
  property: PropertyData;
}

export function FloorplansTabContent({ property }: FloorplansTabContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Floorplans</h2>
      <Card>
        <CardHeader>
          <CardTitle>Property Floorplans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.floorplans?.map((floorplan, index) => (
              <div key={floorplan.id || index} className="relative overflow-hidden rounded-md border">
                <img src={floorplan.url} alt={floorplan.title || `Floorplan ${index + 1}`} className="object-contain w-full h-auto" />
                {floorplan.title && (
                  <div className="p-2 bg-white border-t">
                    <p className="font-medium">{floorplan.title}</p>
                    {floorplan.description && <p className="text-sm text-gray-500">{floorplan.description}</p>}
                  </div>
                )}
              </div>
            ))}
            {(!property.floorplans || property.floorplans.length === 0) && (
              <p className="col-span-full text-center py-8 text-gray-500">No floorplans available</p>
            )}
          </div>
          
          {property.floorplanEmbedScript && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Floorplan Embed</h3>
              <div className="border rounded-md p-4 bg-gray-50">
                <div dangerouslySetInnerHTML={{ __html: property.floorplanEmbedScript }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
