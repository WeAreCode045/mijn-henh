
import React from "react";
import { PropertyData } from "@/types/property";
import { CommunicationsTabContent as PropertyCommunicationsTabContent } from "../content/CommunicationsTabContent";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Communications</h2>
      <p className="mb-4">Property communications management for: {property.title}</p>
      <PropertyCommunicationsTabContent property={property} />
    </div>
  );
}
