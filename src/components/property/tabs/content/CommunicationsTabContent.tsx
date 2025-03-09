
import React from "react";
import { PropertyData } from "@/types/property";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Communications</h2>
      <p>No communications available for property: {property.title}</p>
      {/* Add communications content as needed */}
    </div>
  );
}
