
import { PropertyData } from '@/types/property';
import jsPDF from 'jspdf';

export const generateTitleSection = (
  pdf: jsPDF,
  property: PropertyData,
  primaryColor: string,
  contentX: number,
  y: number,
  contentWidth: number
) => {
  // Top bar with title and price
  pdf.setFillColor(primaryColor);
  pdf.rect(contentX, y, contentWidth, 15, 'F'); // Title bar
  
  // Title and price text
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  
  // Add title (left aligned)
  const title = property.title || 'Property Details';
  pdf.text(title, contentX + 5, y + 10);
  
  // Format price with Euro symbol and thousand separators
  if (property.price) {
    // Convert price to properly formatted string with Euro symbol
    const numericPrice = String(property.price).replace(/[^\d.]/g, '');
    const priceNum = parseFloat(numericPrice);
    
    if (!isNaN(priceNum)) {
      const formattedPrice = '€ ' + priceNum.toLocaleString('nl-NL');
      
      pdf.setFontSize(14);
      const priceX = contentX + contentWidth - 5 - pdf.getTextWidth(formattedPrice);
      pdf.text(formattedPrice, priceX, y + 10);
    } else {
      // If price cannot be parsed as a number, just display it as is
      const priceX = contentX + contentWidth - 5 - pdf.getTextWidth(property.price);
      pdf.text(property.price, priceX, y + 10);
    }
  }
};
