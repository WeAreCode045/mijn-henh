
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
  pdf.rect(x, y, width, 15, 'F'); // Reduced height
  
  // Title and price text
  pdf.setFontSize(14); // Reduced font size
  pdf.setTextColor(255, 255, 255);
  
  // Add title (left aligned)
  const title = property.title || 'Property Details';
  pdf.text(title, x + 5, y + 10); // Reduced padding
  
  // Add price if available (right aligned)
  if (property.price) {
    pdf.setFontSize(14);
    const priceX = x + width - 5 - pdf.getTextWidth(property.price);
    pdf.text(property.price, priceX, y + 10);
  }
  
  // Content area (description on left, features on right)
  const contentY = y + 20; // Reduced spacing
  const contentHeight = height - 20;
  const columnWidth = width / 2 - 2; // Each takes half of available width, with small gap
  
  // Description (left half)
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(x, contentY, columnWidth, contentHeight, 2, 2, 'F');
  
  pdf.setFontSize(10); // Reduced font size
  pdf.setTextColor(80, 80, 80);
  pdf.text('Description', x + 5, contentY + 10); // Reduced padding
  
  pdf.setFontSize(8); // Reduced font size
  pdf.setTextColor(100, 100, 100);
  
  // Ensure description is always shown
  const description = property.description || 'No description available.';
  const splitDescription = pdf.splitTextToSize(description, columnWidth - 10); // Reduced padding
  pdf.text(splitDescription, x + 5, contentY + 18); // Reduced padding
  
  // Features (right half)
  const featuresX = x + columnWidth + 4; // Small gap between columns
  pdf.setFillColor(secondaryColor);
  pdf.roundedRect(featuresX, contentY, columnWidth, contentHeight, 2, 2, 'F');
  
  pdf.setFontSize(10); // Reduced font size
  pdf.setTextColor(255, 255, 255);
  pdf.text('Features', featuresX + 5, contentY + 10); // Reduced padding
  
  // Make sure features are displayed
  pdf.setFontSize(8); // Reduced font size
  if (property.features && property.features.length > 0) {
    property.features.slice(0, 15).forEach((feature, index) => {
      const featureY = contentY + 18 + (index * 10); // Reduced line spacing
      
      if (featureY < contentY + contentHeight - 5) {
        const featureText = feature.description || (typeof feature === 'string' ? feature : 'Feature');
        pdf.text(`• ${featureText}`, featuresX + 5, featureY); // Reduced padding
      }
    });
  } else {
    pdf.text('No features available.', featuresX + 5, contentY + 18); // Reduced padding
  }
};
