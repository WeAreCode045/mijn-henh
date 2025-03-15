
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
  const descriptionHeight = 100; // Description section height
  
  // Description section (left 60%)
  const descriptionY = y + titleBarHeight + 5;
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
  
  // Add QR code below the description text
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
  
  // Make sure features are displayed
  pdf.setFontSize(8);
  if (property.features && property.features.length > 0) {
    property.features.slice(0, 18).forEach((feature, index) => {
      // Reduce line spacing to 5 (from 6)
      const featureY = descriptionY + 18 + (index * 5);
      
      if (featureY < descriptionY + descriptionHeight - 5) {
        const featureText = feature.description || (typeof feature === 'string' ? feature : 'Eigenschap');
        pdf.text(`• ${featureText}`, featuresX + 5, featureY);
      }
    });
  } else {
    pdf.text('No features available.', featuresX + 5, descriptionY + 18);
  }
  
  // Key info cards in a 3x2 grid below the description section
  const keyInfoY = descriptionY + descriptionHeight + 10;
  await generateKeyInfoCards(
    pdf,
    property,
    settings,
    contentX,
    contentWidth,
    keyInfoY,
    70 // Increased height for 2 rows
  );
  
  // Contact section below the features
  const contactY = keyInfoY + 80; // After key info cards
  
  // Contact box with agency details
  pdf.setFillColor(primaryColor);
  pdf.roundedRect(contentX, contactY, contentWidth, 40, 2, 2, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Contact', contentX + 5, contactY + 10);
  
  // Agency name
  if (settings?.name) {
    pdf.setFontSize(9);
    pdf.text(settings.name, contentX + 5, contactY + 20);
  }
  
  // Email and phone on the same line
  let contactLine = '';
  if (settings?.email) contactLine += `Email: ${settings.email}`;
  if (settings?.email && settings?.phone) contactLine += ' | ';
  if (settings?.phone) contactLine += `Tel: ${settings.phone}`;
  
  if (contactLine) {
    pdf.setFontSize(8);
    pdf.text(contactLine, contentX + 5, contactY + 30);
  }
};
