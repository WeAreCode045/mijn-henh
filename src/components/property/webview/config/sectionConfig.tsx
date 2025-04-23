
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { OverviewSection } from "../sections/OverviewSection";
import { DetailsSection } from "../sections/DetailsSection";
import { AreasSection } from "../sections/AreasSection";
import { SingleAreaSection } from "../sections/SingleAreaSection";
import { FloorplanSection } from "../sections/FloorplanSection";
import { NeighborhoodSection } from "../sections/NeighborhoodSection";
import { ContactSection } from "../sections/ContactSection";
import { VirtualTourSection } from "../sections/VirtualTourSection";
import React from "react";

interface SectionConfigProps {
  property: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  waitForPlaces?: boolean;
  isPrintView?: boolean;
}

interface Section {
  title: string;
  content: React.ReactNode;
}

export function getSections({
  property,
  settings,
  currentPage,
  waitForPlaces = false,
  isPrintView = false
}: SectionConfigProps): Section[] {
  // Debug logs for troubleshooting
  console.log('getSections called with currentPage:', currentPage, {
    propertyId: property.id,
    areaCount: property.areas?.length || 0,
    hasFloorplan: !!property.floorplanEmbedScript || (property.floorplans && property.floorplans.length > 0),
    hasVirtualTour: !!property.virtualTourUrl,
    hasYoutubeVideo: !!property.youtubeUrl
  });
  
  // Always create sections in fixed order
  const sections: Section[] = [];

  // 0: Overview (Home)
  sections.push({
    title: "Overview",
    content: <OverviewSection property={property} settings={settings} />
  });
  
  // 1: Details (Introduction)
  sections.push({
    title: "Details",
    content: <DetailsSection property={property} settings={settings} />
  });
  
  // 2..N: Individual area sections
  if (property.areas && property.areas.length > 0) {
    property.areas.forEach((area, index) => {
      sections.push({
        title: `Area: ${area.title || area.name || `Area ${index + 1}`}`,
        content: <SingleAreaSection property={property} settings={settings} areaIndex={index} />
      });
    });
  }

  // Next: Floorplan section (if applicable)
  if (property.floorplanEmbedScript || 
      (property.floorplans && property.floorplans.length > 0)) {
    sections.push({
      title: "Floorplan",
      content: <FloorplanSection property={property} settings={settings} />
    });
  }
  
  // Next: Neighborhood section (always present)
  sections.push({
    title: "Location",
    content: <NeighborhoodSection 
      property={property} 
      waitForPlaces={waitForPlaces}
      settings={settings}
    />
  });
  
  // Next: Virtual tour section (if applicable)
  if ((property.virtualTourUrl && property.virtualTourUrl.trim() !== '') || 
      (property.youtubeUrl && property.youtubeUrl.trim() !== '')) {
    sections.push({
      title: "Media",
      content: <VirtualTourSection property={property} settings={settings} />
    });
  }
  
  // Last: Contact section (always present, unless print view)
  if (!isPrintView) {
    sections.push({
      title: "Contact",
      content: <ContactSection property={property} settings={settings} />
    });
  }

  // Log the final sections structure for debugging
  console.log('Sections generated:', sections.map((s, i) => `${i}: ${s.title}`).join(', '), 
    { totalSections: sections.length });

  return sections;
}
