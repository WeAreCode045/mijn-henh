
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
  
  // Get icons from settings or use defaults
  const buildYearIcon = settings?.iconBuildYear || 'calendar';
  const livingAreaIcon = settings?.iconLivingSpace || 'home';
  const sqftIcon = settings?.iconSqft || 'ruler';
  const bedroomsIcon = settings?.iconBedrooms || 'bed';
  const bathroomsIcon = settings?.iconBathrooms || 'bath';
  const energyClassIcon = settings?.iconEnergyClass || 'zap';
  
  // Property specs in a 1x6 grid
  const specs = [
    { label: 'Build Year', value: property.buildYear || 'N/A', icon: buildYearIcon },
    { label: 'Living Area', value: `${property.livingArea || 'N/A'} m²`, icon: livingAreaIcon },
    { label: 'Plot Size', value: `${property.sqft || 'N/A'} m²`, icon: sqftIcon },
    { label: 'Bedrooms', value: property.bedrooms || 'N/A', icon: bedroomsIcon },
    { label: 'Bathrooms', value: property.bathrooms || 'N/A', icon: bathroomsIcon },
    { label: 'Energy Class', value: property.energyLabel || 'N/A', icon: energyClassIcon }
  ];
  
  // Calculate spec card dimensions (1x6 grid)
  const cols = 6; // 6 columns in 1 row
  const specWidth = width / cols - 2; // Reduced margin
  const specHeight = height; // Keep height as provided (should be smaller)
  const specMargin = 2; // Reduced margin
  
  specs.forEach((spec, index) => {
    const specX = x + (index * (specWidth + specMargin));
    const specY = y;
    
    // Background
    pdf.setFillColor(primaryColor);
    pdf.roundedRect(specX, specY, specWidth, specHeight, 2, 2, 'F');
    
    // Circle for icon
    pdf.setFillColor(secondaryColor);
    pdf.circle(specX + 8, specY + specHeight/2, 4, 'F');
    
    // Draw icon text (simplified representation of icon)
    pdf.setFontSize(6);
    pdf.setTextColor(255, 255, 255);
    const iconText = spec.icon.charAt(0).toUpperCase();
    const textWidth = pdf.getTextWidth(iconText);
    pdf.text(iconText, specX + 8 - textWidth/2, specY + specHeight/2 + 2);
    
    // Label with increased font size and reduced spacing
    pdf.setFontSize(7); // Increased from 6
    pdf.setTextColor(255, 255, 255);
    pdf.text(spec.label, specX + 14, specY + 6);
    
    // Value with reduced spacing from label
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text(String(spec.value), specX + 14, specY + 12); // Reduced space between label and value
  });
};
