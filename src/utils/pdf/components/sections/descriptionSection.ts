
import { PropertyData } from '@/types/property';
import jsPDF from 'jspdf';

export const generateDescriptionSection = (
  pdf: jsPDF,
  property: PropertyData,
  contentX: number,
  descriptionY: number,
  descriptionWidth: number,
  descriptionHeight: number
) => {
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(contentX, descriptionY, descriptionWidth - 5, descriptionHeight, 2, 2, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Description', contentX + 5, descriptionY + 10);
  
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  
  // Ensure description is always shown
  const description = property.description || 'No description available.';
  
  // Process line breaks and ensure proper text wrapping
  // Replace HTML <br> tags with newline character
  const processedDescription = description.replace(/<br\s*\/?>/gi, '\n');
  
  // Split text with proper line breaks
  const splitDescription = pdf.splitTextToSize(processedDescription, descriptionWidth - 15);
  
  // Display the description
  pdf.text(splitDescription, contentX + 5, descriptionY + 18);
};
