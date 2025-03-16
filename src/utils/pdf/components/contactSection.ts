
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { renderIconToPDF } from '../helpers/iconUtils';

export const generateContactSection = async (
  pdf: jsPDF,
  property: PropertyData,
  settings: AgencySettings,
  x: number,
  width: number,
  y: number,
  height: number
) => {
  // Full width contact section with logo, email, phone and QR code
  const logoHeight = height * 0.7;
  const logoWidth = logoHeight * 2; // Assuming logo has 2:1 aspect ratio
  
  let currentX = x;
  const centerY = y + (height / 2);
  
  // Add logo if available
  if (settings?.logoUrl) {
    try {
      pdf.addImage(settings.logoUrl, 'PNG', currentX, y + (height - logoHeight) / 2, logoWidth, logoHeight);
      currentX += logoWidth + 20; // Add space after logo
    } catch (error) {
      console.error('Error adding logo to contact section:', error);
      currentX += 20; // Add space even if logo fails
    }
  }
  
  // Add agency name, email and phone with icons
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  
  if (settings?.name) {
    pdf.setFont('helvetica', 'bold');
    pdf.text(settings.name, currentX, centerY - 12);
    pdf.setFont('helvetica', 'normal');
  }
  
  // Email with icon
  if (settings?.email) {
    await renderIconToPDF(pdf, 'mail', currentX, centerY, 6, 'dark');
    pdf.text(`${settings.email}`, currentX + 8, centerY);
  }
  
  // Phone with icon
  if (settings?.phone) {
    await renderIconToPDF(pdf, 'phone', currentX, centerY + 12, 6, 'dark');
    pdf.text(`${settings.phone}`, currentX + 8, centerY + 12);
  }
  
  // Add QR code on the right side
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
    
    const qrCodeSize = height * 0.8;
    const qrCodeX = x + width - qrCodeSize - 10;
    const qrCodeY = y + (height - qrCodeSize) / 2;
    
    pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
    
    // Add "Scan voor web view" text
    pdf.setFontSize(8);
    const scanText = "Scan QR voor de online brochure";
    const textWidth = pdf.getTextWidth(scanText);
    pdf.text(scanText, qrCodeX + (qrCodeSize - textWidth) / 2, qrCodeY + qrCodeSize + 10);
    
  } catch (error) {
    console.error('Error generating QR code for contact section:', error);
  }
};
