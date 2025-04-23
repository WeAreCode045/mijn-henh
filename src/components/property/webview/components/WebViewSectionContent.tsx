
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
  showHeader?: boolean;
}

export function WebViewSectionContent({
  property,
  settings,
  currentPage,
  isPrintView = false,
  waitForPlaces = false,
  showHeader = true
}: WebViewSectionContentProps) {
  // Validate property data
  if (!property) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">No property data available</p>
      </div>
    );
  }
  
  // Get all available sections for this property
  const sections = getSections({ 
    property, 
    settings, 
    currentPage,
    waitForPlaces,
    isPrintView
  });

  if (!sections || sections.length === 0) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">No sections available</p>
      </div>
    );
  }
  
  // Ensure the currentPage is within bounds
  const safePageIndex = Math.min(Math.max(0, currentPage), sections.length - 1);
  
  // Get the current section based on page index
  const currentSection = sections[safePageIndex];
  
  // Debug information to help identify issues
  console.log('WebViewSectionContent rendering:', {
    currentPage,
    safePageIndex,
    totalSections: sections.length,
    currentSectionTitle: currentSection?.title,
    showHeader,
    sectionTitles: sections.map((s, i) => `${i}: ${s.title}`)
  });
  
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
