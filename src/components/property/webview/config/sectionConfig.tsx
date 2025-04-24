
import React from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { OverviewSection } from "../sections/OverviewSection";
import { DetailsSection } from "../sections/DetailsSection";
import { AreasSection } from "../sections/AreasSection";
import { FloorplanSection } from "../sections/FloorplanSection";
import { NeighborhoodSection } from "../sections/NeighborhoodSection";
import { VirtualTourSection } from "../sections/VirtualTourSection";

interface SectionConfigProps {
  property: PropertyData;
  settings: AgencySettings;
  currentPage?: number;
  waitForPlaces?: boolean;
  isPrintView?: boolean;
}

export function getSections({
  property,
  settings,
  currentPage = 0,
  waitForPlaces = false,
  isPrintView = false
}: SectionConfigProps) {
  const sections = [
    {
      title: "Overview",
      content: <OverviewSection property={property} settings={settings} isPrintView={isPrintView} />
    },
    {
      title: "Details",
      content: <DetailsSection property={property} settings={settings} />
    }
  ];

  // Add areas
  if (property.areas && property.areas.length > 0) {
    property.areas.forEach((area) => {
      sections.push({
        title: area.title || "Area",
        content: <AreasSection property={property} settings={settings} currentAreaId={area.id} />
      });
    });
  }

  // Add floorplan
  if ((property.floorplanEmbedScript && property.floorplanEmbedScript.trim() !== '') ||
      (property.floorplans && property.floorplans.length > 0)) {
    sections.push({
      title: "Floorplan",
      content: <FloorplanSection property={property} settings={settings} />
    });
  }

  // Add neighborhood
  sections.push({
    title: "Neighborhood",
    content: <NeighborhoodSection 
      property={property} 
      settings={settings} 
      waitForPlaces={waitForPlaces}
    />
  });

  // Add media (virtual tour and YouTube)
  if ((property.virtualTourUrl && property.virtualTourUrl.trim() !== '') ||
      (property.youtubeUrl && property.youtubeUrl.trim() !== '')) {
    sections.push({
      title: "Media",
      content: <VirtualTourSection property={property} settings={settings} />
    });
  }

  return sections;
}
