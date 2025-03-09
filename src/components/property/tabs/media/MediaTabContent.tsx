
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MediaTabContentProps {
  property: PropertyData;
}

export function MediaTabContent({ property }: MediaTabContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Media</h2>
      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.images.map((image, index) => (
              <div key={image.id || index} className="relative aspect-square overflow-hidden rounded-md border">
                <img src={image.url} alt={`Property ${index + 1}`} className="object-cover w-full h-full" />
              </div>
            ))}
            {property.images.length === 0 && (
              <p className="col-span-full text-center py-8 text-gray-500">No images available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
