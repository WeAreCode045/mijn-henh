
import React from "react";
import { PropertyData } from "@/types/property";
import { ParticipantsTab } from "@/pages/property/tabs/ParticipantsTab";

interface ParticipantsTabContentProps {
  property: PropertyData;
}

export function ParticipantsTabContent({ property }: ParticipantsTabContentProps) {
  return (
    <ParticipantsTab 
      propertyId={property.id}
      propertyTitle={property.title}
    />
  );
}
