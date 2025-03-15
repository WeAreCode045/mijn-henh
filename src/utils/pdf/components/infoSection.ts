
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
  const descriptionHeight = 90; // Reduced description section height
  
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
  
  // Calculate the height of the description text
  const descTextHeight = splitDescription.length * 4; // Approximate height
  
  // Add QR code within the description area
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
    
    // Position QR code below the description text
    const qrCodeSize = 15;
    const qrCodeX = contentX + 5;
    const qrCodeY = descriptionY + 18 + descTextHeight + 5; // 5px spacing after text
    
    if (qrCodeY + qrCodeSize < descriptionY + descriptionHeight - 5) {
      pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
      
      // Add "Scan for web view" text
      pdf.setFontSize(8);
      const scanText = "Bekijk de online Brochure";
      pdf.text(scanText, qrCodeX + qrCodeSize + 5, qrCodeY + qrCodeSize/2);
    }
    
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  
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
  
  // Key info cards in a 3x2 grid (left 60%)
  const keyInfoWidth = contentWidth * 1;
  await generateKeyInfoCards(
    pdf,
    property,
    settings,
    contentX,
    keyInfoWidth,
    bottomSectionY,
    70 // Height for key info cards section
  );
  
  // Contact section (right 40%) - No background color, dark text
  const contactX = contentX + keyInfoWidth + 5;
  const contactWidth = contentWidth * 0.4 - 5;
  
  // Contact section with no background color
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80); // Dark text
  pdf.text('Contact', contactX + 5, bottomSectionY + 10);
  
  // Agency name
  if (settings?.name) {
    pdf.setFontSize(9);
    pdf.text(settings.name, contactX + 5, bottomSectionY + 20);
  }
  
  // Email and phone
  if (settings?.email) {
    pdf.setFontSize(8);
    pdf.text(`Email: ${settings.email}`, contactX + 5, bottomSectionY + 30);
  }
  
  if (settings?.phone) {
    pdf.setFontSize(8);
    pdf.text(`Tel: ${settings.phone}`, contactX + 5, bottomSectionY + 40);
  }
  
  // Logo or QR code in contact section
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
    
    // Position QR code in contact section
    const qrCodeSize = 20;
    const qrCodeX = contactX + (contactWidth / 2) - (qrCodeSize / 2);
    const qrCodeY = bottomSectionY + 45;
    
    pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
    
    // Add text under QR code
    pdf.setFontSize(7);
    pdf.setTextColor(80, 80, 80); // Dark text
    const scanText = "Scan voor online brochure";
    const textWidth = pdf.getTextWidth(scanText);
    pdf.text(scanText, contactX + (contactWidth / 2) - (textWidth / 2), qrCodeY + qrCodeSize + 5);
    
  } catch (error) {
    console.error('Error generating QR code for contact:', error);
  }
};
