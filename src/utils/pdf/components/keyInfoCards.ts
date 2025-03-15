
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';

export const generateKeyInfoCards = async (
  pdf: jsPDF,
  property: PropertyData,
  settings: AgencySettings,
  x: number,
  width: number,
  y: number,
  height: number
) => {
  // Define colors
  const primaryColor = settings?.primaryColor || '#9b87f5';
  const secondaryColor = settings?.secondaryColor || '#7E69AB';
  
  // Property specs in a 1x6 grid
  const specs = [
    { label: 'Build Year', value: property.buildYear || 'N/A', icon: 'calendar' },
    { label: 'Living Area', value: `${property.livingArea || 'N/A'} m²`, icon: 'home' },
    { label: 'Plot Size', value: `${property.sqft || 'N/A'} m²`, icon: 'ruler' },
    { label: 'Bedrooms', value: property.bedrooms || 'N/A', icon: 'bed' },
    { label: 'Bathrooms', value: property.bathrooms || 'N/A', icon: 'bath' },
    { label: 'Energy Class', value: property.energyLabel || 'N/A', icon: 'zap' }
  ];
  
  // Calculate spec card dimensions (1x6 grid)
  const cols = 6; // 6 columns in 1 row
  const specWidth = width / cols - 2; // Reduced margin
  const specHeight = height; // Reduced height
  const specMargin = 2; // Reduced margin
  
  specs.forEach((spec, index) => {
    const specX = x + (index * (specWidth + specMargin));
    const specY = y;
    
    // Background
    pdf.setFillColor(primaryColor);
    pdf.roundedRect(specX, specY, specWidth, specHeight, 2, 2, 'F');
    
    // Circle for icon - smaller size
    pdf.setFillColor(secondaryColor);
    pdf.circle(specX + 8, specY + specHeight/2, 3, 'F'); // Smaller icon
    
    // Label and value with minimal spacing
    pdf.setFontSize(6); // Smaller font for label
    pdf.setTextColor(255, 255, 255);
    pdf.text(spec.label, specX + 14, specY + 6); // Compact spacing
    
    pdf.setFontSize(8); // Smaller font for value
    pdf.setTextColor(255, 255, 255);
    pdf.text(String(spec.value), specX + 14, specY + 14); // Compact spacing
  });
};
