
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertySection } from "../sections/PropertySection";
import { IntroductionSection } from "../sections/IntroductionSection";
import { FeaturesSection } from "../sections/FeaturesSection";
import { LocationSection } from "../sections/LocationSection";
import { NearbyPlacesSection } from "../sections/NearbyPlacesSection";
import { NearbyPlacesList } from "../nearby/NearbyPlacesList";
import { VirtualTourSection } from "../sections/VirtualTourSection";
import { FloorplanSection } from "../sections/FloorplanSection";
import { FloorplanEmbedSection } from "../sections/FloorplanEmbedSection";
import { YoutubeVideoSection } from "../sections/YoutubeVideoSection";
import { AgentSection } from "../sections/AgentSection";
import { MainGallerySection } from "../sections/MainGallerySection";
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
    {
      id: 'introduction',
      title: 'Introduction',
      Component: IntroductionSection,
      props: { property, settings },
      visible: (p) => Boolean(p.description)
    },
    {
      id: 'main-gallery',
      title: 'Gallery',
      Component: MainGallerySection,
      props: { property, settings },
      visible: (p) => p.images && p.images.length > 0
    },
    {
      id: 'features',
      title: 'Features',
      Component: FeaturesSection,
      props: { property, settings },
      visible: (p) => p.features && p.features.length > 0
    },
    // Display each area as a separate section
    ...(property.areas || []).map((area, index) => {
      // Find the images for this area
      const areaImages = (property.images || [])
        .filter(img => typeof img === 'object' && img.area === area.id)
        .map(img => {
          if (typeof img === 'string') {
            return {
              id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              url: img,
              type: "image" as const
            };
          }
          return {
            ...img,
            type: img.type as "image" | "floorplan"
          };
        });
      
      return {
        id: `area-${area.id || index}`,
        title: area.name || `Area ${index + 1}`,
        Component: SingleAreaSection,
        props: { area, areaImages },
        visible: () => true
      };
    }),
    {
      id: 'location',
      title: 'Location',
      Component: LocationSection,
      props: { property, settings },
      visible: (p) => Boolean(p.location_description || (p.latitude && p.longitude))
    },
    {
      id: 'nearby-places',
      title: 'Nearby Places',
      Component: NearbyPlacesSection,
      props: { 
        property, 
        settings,
        children: <NearbyPlacesList 
          places={property.nearby_places || []} 
          cities={property.nearby_cities || []}
        /> 
      },
      visible: (p) => (p.nearby_places && p.nearby_places.length > 0) || (p.nearby_cities && p.nearby_cities.length > 0)
    },
    {
      id: 'virtual-tour',
      title: 'Virtual Tour',
      Component: VirtualTourSection,
      props: { property, settings },
      visible: (p) => Boolean(p.virtualTourUrl)
    },
    {
      id: 'floorplan',
      title: 'Floorplan',
      Component: FloorplanSection,
      props: { 
        property, 
        settings,
        floorplans: convertToPropertyImageArray(property.floorplans || [])
      },
      visible: (p) => p.floorplans && p.floorplans.length > 0
    },
    {
      id: 'floorplan-embed',
      title: 'Interactive Floorplan',
      Component: FloorplanEmbedSection,
      props: { property, settings },
      visible: (p) => Boolean(p.floorplanEmbedScript)
    },
    {
      id: 'youtube',
      title: 'Video',
      Component: YoutubeVideoSection,
      props: { property, settings },
      visible: (p) => Boolean(p.youtubeUrl)
    },
    {
      id: 'agent',
      title: 'Agent',
      Component: AgentSection,
      props: { property, settings },
      visible: (p) => Boolean(p.agent)
    }
  ];

  return sections.filter(section => section.visible(property, settings));
};

export function getDefaultSection(property: PropertyData): string {
  if (property.description) return 'introduction';
  if (property.images && property.images.length > 0) return 'main-gallery';
  if (property.features && property.features.length > 0) return 'features';
  return 'property';
}
