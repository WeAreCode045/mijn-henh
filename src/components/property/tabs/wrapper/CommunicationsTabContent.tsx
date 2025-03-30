import React from "react";
import { PropertyData } from "@/types/property";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Communications</h2>
      <p>Property communications management for: {property.title}</p>
      {/* Add your communications management UI here */}
    </div>
  );
}
