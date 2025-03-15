
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';

export const generateRightSide = async (
  pdf: jsPDF,
  property: PropertyData,
  settings: AgencySettings,
  margin: number,
  contentWidth: number,
  pageHeight: number,
  bottomBarHeight: number,
  bottomMargin: number
) => {
  // Define colors
  const primaryColor = settings?.primaryColor || '#9b87f5';
  const secondaryColor = settings?.secondaryColor || '#7E69AB';

  // Right side starting position and width
  const rightSideX = margin + contentWidth / 2 + 5;
  const rightSideWidth = contentWidth / 2 - 5;
  
  // Top bar with title and price
  pdf.setFillColor(primaryColor);
  pdf.rect(rightSideX, margin, rightSideWidth, 20, 'F');
  
  // Title and price text
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  
  // Add title (left aligned)
  const title = property.title || 'Property Details';
  pdf.text(title, rightSideX + 10, margin + 13);
  
  // Add price if available (right aligned)
  if (property.price) {
    pdf.setFontSize(14);
    const priceX = rightSideX + rightSideWidth - 10 - pdf.getTextWidth(property.price);
    pdf.text(property.price, priceX, margin + 13);
  }
  
  // Property specs section with icons (3x2 grid)
  const specsStartY = margin + 30;
  const specs = [
    { label: 'Build Year', value: property.buildYear || 'N/A', icon: 'calendar' },
    { label: 'Plot Size', value: `${property.sqft || 'N/A'} m²`, icon: 'ruler' },
    { label: 'Living Area', value: `${property.livingArea || 'N/A'} m²`, icon: 'home' },
    { label: 'Bedrooms', value: property.bedrooms || 'N/A', icon: 'bed' },
    { label: 'Bathrooms', value: property.bathrooms || 'N/A', icon: 'bath' },
    { label: 'Energy Class', value: property.energyLabel || 'N/A', icon: 'zap' }
  ];
  
  // Calculate spec card dimensions (3x2 grid)
  const cols = 3; // Changed from 2 to 3 columns
  const rows = 2; // Changed from 3 to 2 rows
  const specWidth = rightSideWidth / cols - 5;
  const specHeight = 35; // Keep consistent height
  const specMargin = 5;
  
  specs.forEach((spec, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const specX = rightSideX + (col * (specWidth + specMargin));
    const specY = specsStartY + (row * (specHeight + specMargin));
    
    // Background
    pdf.setFillColor(primaryColor);
    pdf.roundedRect(specX, specY, specWidth, specHeight, 3, 3, 'F');
    
    // Circle for icon - smaller size
    pdf.setFillColor(secondaryColor);
    pdf.circle(specX + 12, specY + 15, 5, 'F'); // Made icon smaller (5px radius)
    
    // Label and value with improved spacing
    pdf.setFontSize(9); // Smaller font for label
    pdf.setTextColor(255, 255, 255);
    pdf.text(spec.label, specX + 22, specY + 12); // Moved label up
    
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text(String(spec.value), specX + 22, specY + 24); // Reduced gap between label and value
  });
  
  // Description and features section (starts after specs)
  const textSectionY = specsStartY + (rows * (specHeight + specMargin)) + 10;
  const textSectionHeight = pageHeight - textSectionY - bottomBarHeight - bottomMargin;
  
  // Description (left half of bottom right)
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(rightSideX, textSectionY, rightSideWidth / 2 - 5, textSectionHeight, 3, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Description', rightSideX + 10, textSectionY + 15);
  
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  
  // Ensure description is always shown (use empty string if not available)
  const description = property.description || 'No description available.';
  const splitDescription = pdf.splitTextToSize(description, rightSideWidth / 2 - 25);
  pdf.text(splitDescription, rightSideX + 10, textSectionY + 25);
  
  // Features (right half of bottom right)
  pdf.setFillColor(secondaryColor);
  pdf.roundedRect(rightSideX + rightSideWidth / 2 + 5, textSectionY, rightSideWidth / 2 - 5, textSectionHeight, 3, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Features', rightSideX + rightSideWidth / 2 + 15, textSectionY + 15);
  
  // Make sure features are displayed even if empty
  pdf.setFontSize(10);
  if (property.features && property.features.length > 0) {
    property.features.slice(0, 12).forEach((feature, index) => {
      const featureY = textSectionY + 30 + (index * 15);
      
      if (featureY < textSectionY + textSectionHeight - 10) {
        pdf.text(`• ${feature.description || feature.name || feature}`, rightSideX + rightSideWidth / 2 + 15, featureY);
      }
    });
  } else {
    pdf.text('No features available.', rightSideX + rightSideWidth / 2 + 15, textSectionY + 30);
  }
};
