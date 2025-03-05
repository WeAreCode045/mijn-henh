
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { OverviewSection } from "../sections/OverviewSection";
import { DetailsSection } from "../sections/DetailsSection";
import { AreasSection } from "../sections/AreasSection";
import { NeighborhoodSection } from "../sections/NeighborhoodSection";
import { ContactSection } from "../sections/ContactSection";
import React from "react";

interface SectionConfigProps {
  property: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  waitForPlaces?: boolean;
}

interface Section {
  title: string;
  content: React.ReactNode;
}

export function getSections({
  property,
  settings,
  currentPage,
  waitForPlaces = false
}: SectionConfigProps): Section[] {
  const sections: Section[] = [
    {
      title: "Overview",
      content: <OverviewSection property={property} settings={settings} />
    },
    {
      title: "Details",
      content: <DetailsSection property={property} />
    },
    {
      title: "Areas",
      content: <AreasSection property={property} />
    },
    {
      title: "Neighborhood",
      content: <NeighborhoodSection 
        property={property} 
        settings={settings} 
        waitForPlaces={waitForPlaces} 
      />
    },
    {
      title: "Contact",
      content: <ContactSection property={property} settings={settings} />
    }
  ];

  return sections;
}
