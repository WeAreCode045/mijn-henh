import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

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
  
  // Content area (description and features side by side)
  const contentY = y + 20;
  const contentHeight = height - 20;
  
  // Update column width proportion: 60% for description, 40% for features
  const descColumnWidth = contentWidth * 0.6;
  const featuresColumnWidth = contentWidth * 0.4;
  
  // Description (left 60%)
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(contentX, contentY, descColumnWidth - 2, contentHeight, 2, 2, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Description', contentX + 5, contentY + 10);
  
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  
  // Ensure description is always shown
  const description = property.description || 'No description available.';
  const splitDescription = pdf.splitTextToSize(description, descColumnWidth - 10);
  
  // Display the description
  pdf.text(splitDescription, contentX + 5, contentY + 18);
  
  // Calculate the height of the description
  const descHeight = splitDescription.length * 4; // Approximate height
  const qrCodeY = contentY + 22 + descHeight;
  
  // Add QR code below the description
  try {
    const webViewUrl = `${window.location.origin}/property/${property.id}/view`;
    const qrCodeDataUrl = await QRCode.toDataURL(webViewUrl, { 
      width: 12,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Position QR code centered in the description column
    const qrCodeSize = 15;
    const qrCodeX = contentX + (descColumnWidth / 2) - (qrCodeSize / 2);
    
    pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
    
    // Add "Scan for web view" text
    pdf.setFontSize(8);
    const scanText = "Bekijk de online Brochure";
    const textWidth = pdf.getTextWidth(scanText);
    const textX = contentX + (descColumnWidth / 2) - (textWidth / 2);
    pdf.text(scanText, textX, qrCodeY + qrCodeSize + 5);
    
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  
  // Features (right 40%)
  const featuresX = contentX + descColumnWidth;
  pdf.setFillColor(secondaryColor);
  pdf.roundedRect(featuresX, contentY, featuresColumnWidth, contentHeight, 2, 2, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Bijzonderheden', featuresX + 5, contentY + 10);
  
  // Make sure features are displayed
  pdf.setFontSize(8);
  if (property.features && property.features.length > 0) {
    property.features.slice(0, 18).forEach((feature, index) => {
      // Reduce line spacing to 6 (from 10)
      const featureY = contentY + 18 + (index * 6);
      
      if (featureY < contentY + contentHeight - 5) {
        const featureText = feature.description || (typeof feature === 'string' ? feature : 'Eigenschap');
        pdf.text(`• ${featureText}`, featuresX + 5, featureY);
      }
    });
  } else {
    pdf.text('No features available.', featuresX + 5, contentY + 18);
  }
};
