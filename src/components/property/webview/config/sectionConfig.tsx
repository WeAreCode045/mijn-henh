
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
      // Find the images for this area - make sure to handle both string and PropertyImage objects
      const areaImages = (property.images || [])
        .filter(img => {
          // If img is a string, it can't have an area property
          if (typeof img === 'string') return false;
          // If img is an object, check if its area property matches the area id
          return img.area === area.id;
        })
        .map(img => {
          // Ensure all images are PropertyImage objects
          if (typeof img === 'string') {
            // Convert string to PropertyImage - this shouldn't happen based on the filter above
            return {
              id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              url: img,
              type: "image" as const
            };
          }
          return img; // Already a PropertyImage
        });
      
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
