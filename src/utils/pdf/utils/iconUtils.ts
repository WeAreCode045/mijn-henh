
import { findIconDefinition, icon } from '@fortawesome/fontawesome-svg-core';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';
import * as svg2pdf from 'svg2pdf.js';
import jsPDF from 'jspdf';
import { AgencySettings } from '@/types/agency';

// Convert icon name to FontAwesome icon name
export const getIconName = (iconName: string): IconName => {
  // Map common icon names to FontAwesome icon names
  const iconMap: Record<string, IconName> = {
    home: 'home',
    bed: 'bed',
    bath: 'bath',
    car: 'car',
    calendar: 'calendar',
    ruler: 'ruler',
    zap: 'bolt',
    'map-pin': 'map-marker',
    landmark: 'landmark',
    building: 'building',
    house: 'house',
    warehouse: 'warehouse',
    city: 'city',
    tree: 'tree',
    pool: 'swimming-pool',
    key: 'key',
    door: 'door-open',
    sun: 'sun',
    leaf: 'leaf',
  };

  return (iconMap[iconName] || iconName) as IconName;
};

// Add FontAwesome icon to PDF
export const addFontAwesomeIconToPdf = async (
  pdf: jsPDF,
  iconName: string,
  x: number,
  y: number,
  size: number = 10,
  color: string = '#ffffff'
): Promise<void> => {
  try {
    // Convert icon name to FontAwesome icon name
    const faIconName = getIconName(iconName);
    
    // Get icon definition
    const iconDefinition = findIconDefinition({ 
      prefix: 'fas' as IconPrefix, 
      iconName: faIconName 
    });
    
    if (!iconDefinition) {
      console.warn(`Icon definition not found for: ${iconName}`);
      return;
    }

    // Create icon
    const faIcon = icon(iconDefinition, {
      styles: { 'color': color },
      attributes: { 'aria-hidden': 'true' }
    });

    // Create SVG element
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', String(size));
    svgElement.setAttribute('height', String(size));
    svgElement.setAttribute('viewBox', `0 0 ${iconDefinition.icon[0]} ${iconDefinition.icon[1]}`);
    
    // Set icon html as inner HTML
    svgElement.innerHTML = faIcon.html[0];
    
    // Convert to SVG and add to PDF
    await svg2pdf.svg2pdf(svgElement, pdf, {
      x: x - size/2, 
      y: y - size/2,
      width: size,
      height: size
    });
  } catch (error) {
    console.error('Error adding FontAwesome icon to PDF:', error);
    // Fallback to drawing a circle if the icon fails
    pdf.setFillColor(color);
    pdf.circle(x, y, size/2, 'F');
  }
};

// Get icon settings from agency settings
export const getIconNameFromSettings = (
  iconType: string,
  settings: AgencySettings
): string => {
  switch (iconType) {
    case 'buildYear':
      return settings?.iconBuildYear || 'calendar';
    case 'livingArea':
      return settings?.iconLivingSpace || 'home';
    case 'sqft':
      return settings?.iconSqft || 'ruler';
    case 'bedrooms':
      return settings?.iconBedrooms || 'bed';
    case 'bathrooms':
      return settings?.iconBathrooms || 'bath';
    case 'energyClass':
      return settings?.iconEnergyClass || 'zap';
    default:
      return 'home';
  }
};
