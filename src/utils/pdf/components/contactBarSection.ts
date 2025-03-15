
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateContactBarSection = async (
  pdf: jsPDF,
  property: PropertyData,
  settings: AgencySettings,
  x: number,
  width: number,
  y: number,
  height: number = 30
) => {
  try {
    // Background color
    pdf.setFillColor(settings?.primaryColor || '#9b87f5');
    pdf.rect(x, y, width, height, 'F');
    
    const padding = 10;
    const contentX = x + padding;
    const contentWidth = width - (padding * 2);
    
    // Logo on the left (if available)
    if (settings?.logoUrl) {
      try {
        const logoHeight = height - 10;
        const logoWidth = logoHeight * 2; // Adjust based on your logo's aspect ratio
        pdf.addImage(settings.logoUrl, 'PNG', contentX, y + 5, logoWidth, logoHeight);
        
        // Add a divider line after the logo
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(0.5);
        pdf.line(contentX + logoWidth + 10, y + 5, contentX + logoWidth + 10, y + height - 5);
      } catch (error) {
        console.error('Error adding logo to contact bar:', error);
      }
    }
    
    // Contact information (centered)
    const contactX = settings?.logoUrl ? contentX + 100 : contentX;
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    
    // Only add contact info if available
    if (settings?.name) {
      pdf.text(settings.name, contactX, y + 12);
    }
    
    pdf.setFontSize(9);
    let contactInfoY = y + 20;
    
    if (settings?.email) {
      pdf.text(`Email: ${settings.email}`, contactX, contactInfoY);
      contactInfoY += 7;
    }
    
    if (settings?.phone) {
      pdf.text(`Telefoon: ${settings.phone}`, contactX, contactInfoY);
    }
    
    // Generate QR code for property (if we have enough info to create a meaningful URL)
    if (property.id) {
      try {
        // Create a URL for the property (using a domain placeholder)
        const propertyUrl = `https://example.com/property/${property.id}`;
        
        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(propertyUrl, {
          margin: 1,
          width: 100,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        
        // Add QR code to the right side
        const qrSize = height - 10;
        const qrX = x + width - qrSize - padding;
        pdf.addImage(qrCodeDataUrl, 'PNG', qrX, y + 5, qrSize, qrSize);
        
        // Add "Scan for more info" text
        pdf.setFontSize(7);
        pdf.setTextColor(255, 255, 255);
        pdf.text('Scan voor meer informatie', qrX - 30, y + height - 5);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  } catch (error) {
    console.error('Error generating contact bar section:', error);
  }
};
