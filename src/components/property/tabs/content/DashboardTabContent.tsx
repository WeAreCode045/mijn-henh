
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
      {/* Add more dashboard content as needed */}
    </div>
  );
}
