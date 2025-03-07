
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
  // Get sections based on the current property and page
  const sections = getSections({ 
    property, 
    settings, 
    currentPage,
    waitForPlaces,
    isPrintView
  });

  // Check if we have content for this page
  if (!sections || !sections[currentPage]) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">No content available for this page</p>
      </div>
    );
  }

  return (
    <div className="webview-section p-4 mb-8">
      {sections[currentPage]?.content}
    </div>
  );
}
