
import React from 'react';
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { getSections, getDefaultSection } from '../config/sectionConfig';

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
  // Get all available sections
  const allSections = getSections(property, settings);
  
  // If there are no sections, show a message
  if (allSections.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-500">No content available</h3>
      </div>
    );
  }
  
  // Get the section to display based on currentPage
  const sectionIndex = Math.min(currentPage, allSections.length - 1);
  const currentSection = allSections[sectionIndex];
  
  if (!currentSection) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-500">Section not found</h3>
      </div>
    );
  }
  
  // Render the component for the current section
  const { Component, props } = currentSection;
  
  return (
    <div className="section-content">
      <Component {...props} />
    </div>
  );
}
