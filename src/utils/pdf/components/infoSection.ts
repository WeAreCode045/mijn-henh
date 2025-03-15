
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';

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
  
  // Top bar with title and price
  pdf.setFillColor(primaryColor);
  pdf.rect(x, y, width, 20, 'F');
  
  // Title and price text
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  
  // Add title (left aligned)
  const title = property.title || 'Property Details';
  pdf.text(title, x + 10, y + 13);
  
  // Add price if available (right aligned)
  if (property.price) {
    pdf.setFontSize(14);
    const priceX = x + width - 10 - pdf.getTextWidth(property.price);
    pdf.text(property.price, priceX, y + 13);
  }
  
  // Content area (description on left, features on right)
  const contentY = y + 25;
  const contentHeight = height - 25;
  const columnWidth = width / 2 - 5;
  
  // Description (left half)
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(x, contentY, columnWidth, contentHeight, 3, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Description', x + 8, contentY + 12); // Reduced padding
  
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  
  // Ensure description is always shown
  const description = property.description || 'No description available.';
  const splitDescription = pdf.splitTextToSize(description, columnWidth - 16); // Reduced padding
  pdf.text(splitDescription, x + 8, contentY + 20); // Reduced padding
  
  // Features (right half)
  pdf.setFillColor(secondaryColor);
  pdf.roundedRect(x + columnWidth + 10, contentY, columnWidth, contentHeight, 3, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Features', x + columnWidth + 18, contentY + 12); // Reduced padding
  
  // Make sure features are displayed
  pdf.setFontSize(10);
  if (property.features && property.features.length > 0) {
    property.features.slice(0, 15).forEach((feature, index) => {
      const featureY = contentY + 20 + (index * 13); // Reduced line spacing
      
      if (featureY < contentY + contentHeight - 8) {
        const featureText = feature.description || (typeof feature === 'string' ? feature : 'Feature');
        pdf.text(`• ${featureText}`, x + columnWidth + 18, featureY); // Reduced padding
      }
    });
  } else {
    pdf.text('No features available.', x + columnWidth + 18, contentY + 20);
  }
};
