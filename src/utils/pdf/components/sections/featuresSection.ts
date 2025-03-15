
import { PropertyData } from '@/types/property';
import jsPDF from 'jspdf';

export const generateFeaturesSection = (
  pdf: jsPDF,
  property: PropertyData,
  secondaryColor: string,
  featuresX: number,
  descriptionY: number,
  featuresWidth: number,
  descriptionHeight: number
) => {
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
};
