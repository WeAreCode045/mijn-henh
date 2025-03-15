
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';

export const generateBottomBar = async (
  pdf: jsPDF, 
  property: PropertyData, 
  settings: AgencySettings,
  pageWidth: number,
  pageHeight: number
) => {
  const bottomBarHeight = 20;
  
  // Define colors
  const primaryColor = settings?.primaryColor || '#9b87f5';
  
  // Bottom bar with contact info - full width at bottom
  const bottomBarY = pageHeight - bottomBarHeight;
  pdf.setFillColor(primaryColor);
  pdf.rect(0, bottomBarY, pageWidth, bottomBarHeight, 'F');
  
  // Contact information
  const margin = 15;
  pdf.setFontSize(12); // Slightly smaller font for bottom bar
  pdf.setTextColor(255, 255, 255);
  
  // Agency name (if available)
  if (settings?.name) {
    pdf.text(settings.name, margin, bottomBarY + 10);
  }
  
  // Email address (if available)
  if (settings?.email) {
    const emailX = margin + 80; // Position after name
    pdf.text(`Email: ${settings.email}`, emailX, bottomBarY + 10);
  }
  
  // Phone number (if available)
  if (settings?.phone) {
    const phoneText = `Phone: ${settings.phone}`;
    const phoneX = margin + 200; // Position after email
    pdf.text(phoneText, phoneX, bottomBarY + 10);
  }
};
