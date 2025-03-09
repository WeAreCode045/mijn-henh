
import React from "react";
import { PropertyData } from "@/types/property";

interface DashboardTabContentProps {
  property: PropertyData;
}

export function DashboardTabContent({ property }: DashboardTabContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Property Dashboard</h2>
      <p>Property ID: {property.id}</p>
      <p>Title: {property.title}</p>
      {property.price && <p>Price: {property.price}</p>}
      {property.address && <p>Address: {property.address}</p>}
      {property.created_at && <p>Created: {new Date(property.created_at).toLocaleDateString()}</p>}
      {property.updated_at && <p>Last Updated: {new Date(property.updated_at).toLocaleDateString()}</p>}
      {/* Add more dashboard content as needed */}
    </div>
  );
}
