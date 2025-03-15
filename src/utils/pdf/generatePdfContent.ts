
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import { generateImageSection } from './components/imageSection';
import { generateInfoSection } from './components/infoSection';
import { generateKeyInfoCards } from './components/keyInfoCards';

export const generatePdfContent = async (
  pdf: jsPDF, 
  property: PropertyData, 
  settings: AgencySettings, 
  pageWidth: number, 
  pageHeight: number
) => {
  // Define common dimensions
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  // Calculate the available content height (excluding margins)
  const availableHeight = pageHeight - margin * 2;
  
  // Calculate widths for left and right columns
  const leftColumnWidth = contentWidth * 0.4; // 40% for images
  const rightColumnWidth = contentWidth * 0.6; // 60% for title/description/features
  
  // Generate the main image and featured images section (left column)
  await generateImageSection(
    pdf, 
    property, 
    margin, 
    leftColumnWidth, 
    margin, 
    availableHeight
  );
  
  // Generate the info section (title, description, features, key info cards, contact info) on the right column
  await generateInfoSection(
    pdf, 
    property, 
    settings, 
    margin + leftColumnWidth, 
    rightColumnWidth, 
    margin, 
    availableHeight
  );
};
