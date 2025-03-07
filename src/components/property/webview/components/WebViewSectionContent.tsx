
import React from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections } from "../config/sectionConfig";

interface WebViewSectionContentProps {
  property: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  isPrintView?: boolean;
  waitForPlaces?: boolean;
}

export function WebViewSectionContent({
  property,
  settings,
  currentPage,
  isPrintView = false,
  waitForPlaces = false
}: WebViewSectionContentProps) {
  // Validate property data
  if (!property) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">No property data available</p>
      </div>
    );
  }

  // Get sections based on the current property and page
  const sections = getSections({ 
    property, 
    settings, 
    currentPage,
    waitForPlaces,
    isPrintView
  });

  // Check if currentPage is out of bounds
  if (!sections || currentPage < 0 || currentPage >= sections.length) {
    console.error(`Invalid page: ${currentPage}, available sections: ${sections?.length || 0}`);
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">Invalid page index</p>
      </div>
    );
  }

  // Get the current section
  const currentSection = sections[currentPage];
  
  // Check if we have content for this page
  if (!currentSection || !currentSection.content) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">No content available for this page</p>
      </div>
    );
  }

  return (
    <div className="webview-section p-4 mb-8">
      {currentSection.content}
    </div>
  );
}
