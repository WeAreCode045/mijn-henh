
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
    hasFloorplan: !!property.floorplanEmbedScript,
    hasVirtualTour: !!property.virtualTourUrl,
    hasYoutubeVideo: !!property.youtubeUrl
  });

  // Start with the fixed sections
  const sections: Section[] = [
    {
      title: "Overview",
      content: <OverviewSection property={property} settings={settings} />
    },
    {
      title: "Details",
      content: <DetailsSection property={property} settings={settings} />
    }
  ];
  
  // Add individual area sections if they exist
  if (property.areas && property.areas.length > 0) {
    property.areas.forEach((area, index) => {
      sections.push({
        title: `Area: ${area.title || `Area ${index + 1}`}`,
        content: <SingleAreaSection property={property} settings={settings} areaIndex={index} />
      });
    });
  }

  // These sections need to come in a specific order
  // Add floorplan section 
  if (property.floorplanEmbedScript || 
      (property.floorplans && property.floorplans.length > 0)) {
    sections.push({
      title: "Floorplan",
      content: <FloorplanSection property={property} settings={settings} />
    });
  }
  
  // Add neighborhood section (Location)
  sections.push({
    title: "Neighborhood",
    content: <NeighborhoodSection 
      property={property} 
      waitForPlaces={waitForPlaces}
      settings={settings}
    />
  });
  
  // Add virtual tour section if either virtual tour or YouTube video is available
  if ((property.virtualTourUrl && property.virtualTourUrl.trim() !== '') || 
      (property.youtubeUrl && property.youtubeUrl.trim() !== '')) {
    sections.push({
      title: "Virtual Experience",
      content: <VirtualTourSection property={property} settings={settings} />
    });
  }
  
  // Add contact section if not in print view
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
