
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateBottomBar = async (
  pdf: jsPDF, 
  property: PropertyData, 
  settings: AgencySettings,
  pageWidth: number,
  pageHeight: number
) => {
  const bottomBarHeight = 15;
  const margin = 15;
  
  // Define colors
  const primaryColor = settings?.primaryColor || '#9b87f5';
  
  // Bottom bar with contact info and QR code - with margin
  const bottomBarY = pageHeight - bottomBarHeight;
  pdf.setFillColor(primaryColor);
  pdf.rect(0, bottomBarY, pageWidth, bottomBarHeight, 'F');
  
  // Contact information
  pdf.setFontSize(9); // Slightly smaller font for bottom bar
  pdf.setTextColor(255, 255, 255);
  
  // Email address (if available)
  if (settings?.email) {
    pdf.text(`Email: ${settings.email}`, margin, bottomBarY + 10);
  }
  
  // Phone number (if available)
  if (settings?.phone) {
    const phoneText = `Phone: ${settings.phone}`;
    const phoneX = margin + 100; // Position after email
    pdf.text(phoneText, phoneX, bottomBarY + 10);
  }
  
  // QR Code for web view
  try {
    const webViewUrl = `${window.location.origin}/property/${property.id}/view`;
    const qrCodeDataUrl = await QRCode.toDataURL(webViewUrl, { 
      width: 12, // Smaller QR code
      margin: 0,
      color: {
        dark: '#FFFFFF',
        light: primaryColor
      }
    });
    
    // Position QR code on the right side of the bottom bar
    const qrCodeX = pageWidth - margin - 12; // 12mm from right edge (smaller QR code)
    const qrCodeY = bottomBarY + 1.5; // 1.5mm from bottom bar top
    const qrCodeSize = 12; // Smaller QR code size
    
    pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
    
    // Add "Scan for web view" text
    pdf.setFontSize(7); // Smaller text size
    const scanText = "Scan for web view";
    const textWidth = pdf.getTextWidth(scanText);
    const textX = qrCodeX + (qrCodeSize - textWidth) / 2;
    pdf.text(scanText, textX, qrCodeY - 1);
    
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};
