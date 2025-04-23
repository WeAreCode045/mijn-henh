
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { OverviewSection } from "../sections/OverviewSection";
import { DetailsSection } from "../sections/DetailsSection";
import { SingleAreaSection } from "../sections/SingleAreaSection";
import { FloorplanSection } from "../sections/FloorplanSection";
import { NeighborhoodSection } from "../sections/NeighborhoodSection";
import { VirtualTourSection } from "../sections/VirtualTourSection";

interface SectionConfigOptions {
  property: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  waitForPlaces?: boolean;
  isPrintView?: boolean;
}

interface SectionConfig {
  title: string;
  content: React.ReactNode;
  key: string;
}

export function getSections({ 
  property, 
  settings, 
  currentPage,
  waitForPlaces = false,
  isPrintView = false
}: SectionConfigOptions): SectionConfig[] {
  // Safety check
  if (!property) return [];
  
  const sections: SectionConfig[] = [];
  
  // Fixed sections
  sections.push({
    title: "Overview",
    content: <OverviewSection property={property} settings={settings} />,
    key: "overview"
  });
  
  sections.push({
    title: "Details",
    content: <DetailsSection property={property} settings={settings} />,
    key: "details"
  });
  
  // Dynamic area sections
  if (property.areas && property.areas.length > 0) {
    property.areas.forEach((area, index) => {
      sections.push({
        title: area.title || area.name || `Area ${index + 1}`,
        content: <SingleAreaSection property={property} settings={settings} areaIndex={index} />,
        key: `area-${index}`
      });
    });
  }
  
  // Floorplan section (if available)
  if ((property.floorplanEmbedScript && property.floorplanEmbedScript.trim() !== '') ||
      (property.floorplans && property.floorplans.length > 0)) {
    sections.push({
      title: "Floorplans",
      content: <FloorplanSection property={property} settings={settings} />,
      key: "floorplan"
    });
  }
  
  // Neighborhood section
  sections.push({
    title: "Location",
    content: <NeighborhoodSection property={property} settings={settings} waitForPlaces={waitForPlaces} />,
    key: "neighborhood"
  });
  
  // Virtual tour section (if available)
  if ((property.virtualTourUrl && property.virtualTourUrl.trim() !== '') ||
      (property.youtubeUrl && property.youtubeUrl.trim() !== '')) {
    sections.push({
      title: "Media",
      content: <VirtualTourSection property={property} settings={settings} />,
      key: "virtualtour"
    });
  }
  
  return sections;
}
