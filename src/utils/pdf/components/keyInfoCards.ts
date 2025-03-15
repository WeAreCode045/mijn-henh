
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import { addFontAwesomeIconToPdf, getIconNameFromSettings } from '../utils/iconUtils';

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
  
  // Property specs in a 3x2 grid
  const specs = [
    { label: 'Bouwjaar', value: property.buildYear || 'N/A', iconType: 'buildYear' },
    { label: 'Woonoppervlak', value: `${property.livingArea || 'N/A'} m²`, iconType: 'livingArea' },
    { label: 'Perceeloppervlak', value: `${property.sqft || 'N/A'} m²`, iconType: 'sqft' },
    { label: 'Slaapkamers', value: property.bedrooms || 'N/A', iconType: 'bedrooms' },
    { label: 'Badkamers', value: property.bathrooms || 'N/A', iconType: 'bathrooms' },
    { label: 'Energie klasse', value: property.energyLabel || 'N/A', iconType: 'energyClass' }
  ];
  
  // Calculate spec card dimensions (3x2 grid)
  const cols = 3; // 3 columns
  const rows = 2; // 2 rows
  const specWidth = (width / cols) - 4; // Add spacing between cards
  const specHeight = height / rows - 4; // Add spacing between rows
  const specMargin = 4; // Margin between cards
  
  // Create and render each spec card
  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    const specX = x + (col * (specWidth + specMargin));
    const specY = y + (row * (specHeight + specMargin));
    
    // Background
    pdf.setFillColor(primaryColor);
    pdf.roundedRect(specX, specY, specWidth, specHeight, 2, 2, 'F');
    
    // Get icon name from settings
    const iconName = getIconNameFromSettings(spec.iconType, settings);
    
    // Position icon at left side of the card
    const iconX = specX + 10;
    const iconY = specY + 13;
    
    // Add icon using FontAwesome
    await addFontAwesomeIconToPdf(pdf, iconName, iconX, iconY, 8, '#ffffff');
    
    // Label to the right of the icon
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text(spec.label, specX + 20, specY + 10);
    
    // Value below label
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text(String(spec.value), specX + 20, specY + 18);
  }
};
