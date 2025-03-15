
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { generateKeyInfoCards } from './keyInfoCards';

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
  
  // Top bar with title and price
  pdf.setFillColor(primaryColor);
  pdf.rect(contentX, y, contentWidth, 15, 'F'); // Title bar
  
  // Title and price text
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  
  // Add title (left aligned)
  const title = property.title || 'Property Details';
  pdf.text(title, contentX + 5, y + 10);
  
  // Add price if available (right aligned)
  if (property.price) {
    pdf.setFontSize(14);
    const priceX = contentX + contentWidth - 5 - pdf.getTextWidth(property.price);
    pdf.text(property.price, priceX, y + 10);
  }
  
  // Define section heights and positions
  const titleBarHeight = 15;
  const descriptionY = y + titleBarHeight + 5;
  const descriptionHeight = 70; // Reduced description section height
  
  // Description section (left 60%)
  const descriptionWidth = contentWidth * 0.6;
  
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(contentX, descriptionY, descriptionWidth - 5, descriptionHeight, 2, 2, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Description', contentX + 5, descriptionY + 10);
  
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  
  // Ensure description is always shown
  const description = property.description || 'No description available.';
  const splitDescription = pdf.splitTextToSize(description, descriptionWidth - 15);
  
  // Display the description
  pdf.text(splitDescription, contentX + 5, descriptionY + 18);
  
  // Features section (right 40%)
  const featuresX = contentX + descriptionWidth;
  const featuresWidth = contentWidth * 0.4;
  
  pdf.setFillColor(secondaryColor);
  pdf.roundedRect(featuresX, descriptionY, featuresWidth, descriptionHeight, 2, 2, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Bijzonderheden', featuresX + 5, descriptionY + 10);
  
  // Make sure features are displayed with less spacing between rows
  pdf.setFontSize(8);
  if (property.features && property.features.length > 0) {
    property.features.slice(0, 18).forEach((feature, index) => {
      // Reduce line spacing to 4 (from 5)
      const featureY = descriptionY + 18 + (index * 4);
      
      if (featureY < descriptionY + descriptionHeight - 5) {
        const featureText = feature.description || (typeof feature === 'string' ? feature : 'Eigenschap');
        pdf.text(`• ${featureText}`, featuresX + 5, featureY);
      }
    });
  } else {
    pdf.text('No features available.', featuresX + 5, descriptionY + 18);
  }
  
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
