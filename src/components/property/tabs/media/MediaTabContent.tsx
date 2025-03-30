import React from "react";
import { PropertyData } from "@/types/property";

interface MediaTabContentProps {
  property: PropertyData;
}

export function MediaTabContent({ property }: MediaTabContentProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Media</h2>
      <p>Media management for property: {property.title}</p>
      {/* Add your media management UI here */}
    </div>
  );
}
