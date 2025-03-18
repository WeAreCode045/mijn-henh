
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { SingleAreaSection } from "../sections/SingleAreaSection";
import { convertToPropertyImageArray } from "@/utils/propertyDataAdapters";

// Define the structure for a section configuration
export interface SectionConfig {
  id: string;
  title: string;
  Component: React.FC<any>;
  props?: any;
  visible: (property: PropertyData, settings: AgencySettings) => boolean;
}

export const getSections = (property: PropertyData, settings: AgencySettings): SectionConfig[] => {
  const sections: SectionConfig[] = [
    // Display each area as a separate section
    ...(property.areas || []).map((area, index) => {
      // Find the images for this area
      const areaImages = (property.images || [])
        .filter(img => img.area === area.id)
        .map(img => convertToPropertyImageArray([img])[0]);
      
      return {
        id: `area-${area.id || index}`,
        title: area.name || `Area ${index + 1}`,
        Component: SingleAreaSection,
        props: { area, areaImages },
        visible: () => true
      };
    })
  ];

  return sections.filter(section => section.visible(property, settings));
};

export function getDefaultSection(property: PropertyData): string {
  if (property.areas && property.areas.length > 0) {
    return `area-${property.areas[0].id}`;
  }
  return 'property';
}
