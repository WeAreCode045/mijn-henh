
import React from "react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections } from "../config/sectionConfig";
import { usePageCalculation } from "../hooks/usePageCalculation";

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
  const { getSectionIndex, calculateTotalPages } = usePageCalculation();
  
  // Validate property data
  if (!property) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">No property data available</p>
      </div>
    );
  }
  
  // Check if floorplan exists
  console.log('Property has floorplan embed script:', !!property.floorplanEmbedScript);
  if (property.floorplanEmbedScript) {
    console.log('FloorplanEmbedScript exists, first 50 chars:', property.floorplanEmbedScript.substring(0, 50) + '...');
  }

  // Get sections based on the current property and page
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
  
  // Get total pages
  const totalPages = calculateTotalPages(property, isPrintView);
  
  // Get validated section index and ensure it's within boundaries
  const safePageIndex = Math.min(Math.max(0, currentPage), totalPages - 1);
  
  // Get the current section, with fallback to first section if current is not available
  const currentSection = safePageIndex < sections.length ? sections[safePageIndex] : sections[0];
  
  // Debug information to help identify issues
  console.log('WebViewSectionContent rendering:', {
    currentPage,
    safePageIndex,
    totalPages,
    sectionsAvailable: sections.length,
    currentSectionTitle: currentSection?.title,
    showHeader,
    sectionTitles: sections.map(s => s.title)
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
