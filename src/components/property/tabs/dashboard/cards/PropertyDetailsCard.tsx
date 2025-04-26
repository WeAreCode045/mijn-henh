
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "@/types/property";

interface PropertyDetailsCardProps {
  property: PropertyFormData;
}

export function PropertyDetailsCard({ property }: PropertyDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Title</h3>
            <p>{property.title || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Price</h3>
            <p>{property.price || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p>{property.address || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p>{property.status || "Draft"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Bedrooms</h3>
            <p>{property.bedrooms || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Bathrooms</h3>
            <p>{property.bathrooms || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
