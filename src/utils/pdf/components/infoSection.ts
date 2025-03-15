
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import { generateKeyInfoCards } from './keyInfoCards';
import { generateTitleSection } from './sections/titleSection';
import { generateDescriptionSection } from './sections/descriptionSection';
import { generateFeaturesSection } from './sections/featuresSection';

export const generateInfoSection = async (
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
  
  // Add padding to the right container
  const padding = 5;
  const contentX = x + padding;
  const contentWidth = width - (padding * 2);
  
  // Generate the title section
  generateTitleSection(pdf, property, primaryColor, contentX, y, contentWidth);
  
  // Define section heights and positions
  const titleBarHeight = 15;
  const descriptionY = y + titleBarHeight + 5;
  const descriptionHeight = 70; // Reduced description section height
  
  // Description section (left 60%)
  const descriptionWidth = contentWidth * 0.6;
  
  // Generate the description section
  generateDescriptionSection(pdf, property, contentX, descriptionY, descriptionWidth, descriptionHeight);
  
  // Features section (right 40%)
  const featuresX = contentX + descriptionWidth;
  const featuresWidth = contentWidth * 0.4;
  
  // Generate the features section
  generateFeaturesSection(pdf, property, secondaryColor, featuresX, descriptionY, featuresWidth, descriptionHeight);
  
  // Bottom section layout (after description & features)
  const bottomSectionY = descriptionY + descriptionHeight + 10;
  
  // Key info cards in a 3x2 grid (full width)
  const keyInfoWidth = contentWidth;
  await generateKeyInfoCards(
    pdf,
    property,
    settings,
    contentX,
    keyInfoWidth,
    bottomSectionY,
    60 // Height for key info cards section
  );
};
