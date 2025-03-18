import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { OverviewSection } from "../sections/OverviewSection";
import { DetailsSection } from "../sections/DetailsSection";
import { AreasSection } from "../sections/AreasSection";
import { SingleAreaSection } from "../sections/SingleAreaSection";
import { FloorplanSection } from "../sections/FloorplanSection";
import { NeighborhoodSection } from "../sections/NeighborhoodSection";
import { ContactSection } from "../sections/ContactSection";
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
  // Debug log for floorplan script
  console.log('getSections - Property floorplan check:', {
    propertyId: property.id,
    hasFloorplanScript: !!property.floorplanEmbedScript,
    scriptType: typeof property.floorplanEmbedScript,
    scriptLength: property.floorplanEmbedScript ? property.floorplanEmbedScript.length : 0,
    scriptEmpty: property.floorplanEmbedScript === '',
    scriptFirstChars: property.floorplanEmbedScript ? property.floorplanEmbedScript.substring(0, 30) + '...' : 'none'
  });

  // Start with the fixed sections
  const sections: Section[] = [
    {
      title: "Overview",
      content: <OverviewSection property={property} settings={settings} />
    },
    {
      title: "Details",
      content: <DetailsSection property={property} />
    }
  ];
  
  // Add individual area sections
  if (property.areas && property.areas.length > 0) {
    property.areas.forEach((area, index) => {
      sections.push({
        title: `Area: ${area.title || `Area ${index + 1}`}`,
        content: <SingleAreaSection property={property} settings={settings} areaIndex={index} />
      });
    });
  }
  
  // Add floorplan section if available - improved check to handle empty strings
  if (property.floorplanEmbedScript && property.floorplanEmbedScript.trim() !== '') {
    console.log('Adding floorplan section to sections array');
    sections.push({
      title: "Floorplan",
      content: <FloorplanSection property={property} settings={settings} />
    });
  } else {
    console.log('Skipping floorplan section - script is empty or missing:', 
      property.floorplanEmbedScript === undefined ? 'undefined' : 
      property.floorplanEmbedScript === null ? 'null' : 
      property.floorplanEmbedScript === '' ? 'empty string' : 
      `non-empty but possibly whitespace: "${property.floorplanEmbedScript}"`);
  }
  
  // Add remaining sections
  sections.push({
    title: "Neighborhood",
    content: <NeighborhoodSection 
      property={property} 
      settings={settings} 
      waitForPlaces={waitForPlaces} 
    />
  });
  
  // Add contact section if not in print view
  if (!isPrintView) {
    sections.push({
      title: "Contact",
      content: <ContactSection property={property} settings={settings} />
    });
  }

  // Log the final sections structure for debugging
  console.log('Sections generated:', sections.map(s => s.title).join(', '), 
    { totalSections: sections.length, hasFloorplan: !!property.floorplanEmbedScript });

  return sections;
}

export const getAreaSections = (property: PropertyData, settings: AgencySettings) => {
  if (!property.areas || property.areas.length === 0) return [];

  return property.areas.map((area, index) => {
    // Get area images
    const areaImages = property.images
      ? property.images
          .filter(img => {
            if (typeof img === 'string') return false;
            return img.area === area.id;
          })
          .map(img => {
            if (typeof img === 'string') {
              return { id: `img-${index}`, url: img, area: area.id, type: 'image' };
            }
            return img;
          })
      : [];

    return {
      id: `area-${area.id}`,
      title: area.title || area.name,
      component: () => (
        <SingleAreaSection 
          area={area} 
          areaImages={areaImages}
          property={property}
          settings={settings}
          areaIndex={index}
        />
      ),
    };
  });
};
