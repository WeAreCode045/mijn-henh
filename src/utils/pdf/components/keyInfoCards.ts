
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
  
  // Property specs in a 3x2 grid
  const specs = [
    { label: 'Bouwjaar', value: property.buildYear || 'N/A', icon: buildYearIcon },
    { label: 'Woonoppervlak', value: `${property.livingArea || 'N/A'} m²`, icon: livingAreaIcon },
    { label: 'Perceeloppervlak', value: `${property.sqft || 'N/A'} m²`, icon: sqftIcon },
    { label: 'Slaapkamers', value: property.bedrooms || 'N/A', icon: bedroomsIcon },
    { label: 'Badkamers', value: property.bathrooms || 'N/A', icon: bathroomsIcon },
    { label: 'Energie klasse', value: property.energyLabel || 'N/A', icon: energyClassIcon }
  ];
  
  // Calculate spec card dimensions (3x2 grid)
  const cols = 3; // 3 columns
  const rows = 2; // 2 rows
  const specWidth = (width / cols) - 4; // Add spacing between cards
  const specHeight = height / rows - 4; // Add spacing between rows
  const specMargin = 4; // Margin between cards
  
  specs.forEach((spec, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const specX = x + (col * (specWidth + specMargin));
    const specY = y + (row * (specHeight + specMargin));
    
    // Background
    pdf.setFillColor(primaryColor);
    pdf.roundedRect(specX, specY, specWidth, specHeight, 2, 2, 'F');
    
    // Circle for icon
    pdf.setFillColor(secondaryColor);
    pdf.circle(specX + 8, specY + 10, 4, 'F');
    
    // Draw icon text (simplified representation of icon)
    pdf.setFontSize(6);
    pdf.setTextColor(255, 255, 255);
    const iconText = spec.icon.charAt(0).toUpperCase();
    const textWidth = pdf.getTextWidth(iconText);
    pdf.text(iconText, specX + 8 - textWidth/2, specY + 10 + 2);
    
    // Label with increased font size
    pdf.setFontSize(8); // Increased from 7
    pdf.setTextColor(255, 255, 255);
    pdf.text(spec.label, specX + 14, specY + 10);
    
    // Value closer to label
    pdf.setFontSize(9); // Slightly increased
    pdf.setTextColor(255, 255, 255);
    pdf.text(String(spec.value), specX + 14, specY + 18); // Reduced space between label and value
  });
};
