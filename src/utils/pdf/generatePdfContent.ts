
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import { generateImageSection } from './components/imageSection';
import { generateInfoSection } from './components/infoSection';
import { generateContactBarSection } from './components/contactBarSection';
import { BROCHURE_STYLES } from './constants/styles';

export const generatePdfContent = async (
  pdf: jsPDF,
  property: PropertyData,
  settings: AgencySettings,
  pageWidth: number,
  pageHeight: number
) => {
  // Define layout dimensions with margins
  const margin = BROCHURE_STYLES.spacing.margin;
  const contentWidth = pageWidth - (margin * 2);
  
  // Define section heights
  const imageHeight = 120;
  const infoHeight = 100;
  const contactBarHeight = 30;
  
  // Set coordinates for each section
  const imageX = margin;
  const imageY = margin;
  
  const infoX = margin;
  const infoY = imageY + imageHeight + 5;
  
  const contactBarX = margin;
  const contactBarY = pageHeight - contactBarHeight - margin;
  
  // Generate each section
  try {
    // Images section (top half)
    await generateImageSection(pdf, property, imageX, contentWidth, imageY, imageHeight);
    
    // Info section (middle)
    await generateInfoSection(pdf, property, settings, infoX, contentWidth, infoY, infoHeight);
    
    // Contact bar (bottom)
    await generateContactBarSection(pdf, property, settings, contactBarX, contentWidth, contactBarY, contactBarHeight);
  } catch (error) {
    console.error('Error generating PDF content:', error);
  }
};
