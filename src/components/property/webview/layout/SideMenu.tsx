
import { PropertyData } from "@/types/property";
import { useState } from "react";

interface SideMenuProps {
  property: PropertyData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function SideMenu({ property, currentPage, onPageChange }: SideMenuProps) {
  // Calculate menu items based on property data
  const menuItems = generateMenuItems(property);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => onPageChange(item.pageIndex)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                currentPage === item.pageIndex
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Helper function to generate menu items based on property data
function generateMenuItems(property: PropertyData) {
  const menuItems = [
    { label: "Overview", pageIndex: 0 },
    { label: "Details", pageIndex: 1 }
  ];
  
  let currentIndex = 2;
  
  // Add area items
  if (property.areas && property.areas.length > 0) {
    property.areas.forEach((area, index) => {
      menuItems.push({
        label: area.title || `Area ${index + 1}`,
        pageIndex: currentIndex++
      });
    });
  }
  
  // Add floorplan if available
  if ((property.floorplanEmbedScript && property.floorplanEmbedScript.trim() !== '') || 
      (property.floorplans && property.floorplans.length > 0)) {
    menuItems.push({
      label: "Floorplan",
      pageIndex: currentIndex++
    });
  }
  
  // Add neighborhood
  menuItems.push({
    label: "Neighborhood",
    pageIndex: currentIndex++
  });
  
  // Add Media if virtual tour or YouTube video is available
  if ((property.virtualTourUrl && property.virtualTourUrl.trim() !== '') || 
      (property.youtubeUrl && property.youtubeUrl.trim() !== '')) {
    menuItems.push({
      label: "Media",
      pageIndex: currentIndex++
    });
  }
  
  return menuItems;
}
