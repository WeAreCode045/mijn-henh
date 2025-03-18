
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import { createImageSection } from './components/imageSection';
import { generateInfoSection } from './components/infoSection';
import { generateContactSection } from './components/contactSection';

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
  
  // Calculate heights for main content and contact section
  const mainContentHeight = availableHeight * 0.85; // 85% for main content
  const contactSectionHeight = availableHeight * 0.15; // 15% for contact section
  
  // Calculate widths for left and right columns
  const leftColumnWidth = contentWidth * 0.4; // 40% for images
  const rightColumnWidth = contentWidth * 0.6; // 60% for title/description/features
  
  // Generate the main image and featured images section (left column)
  await createImageSection(
    pdf, 
    property, 
    margin, 
    leftColumnWidth, 
    margin, 
    mainContentHeight
  );
  
  // Generate the info section (title, description, features, key info cards) on the right column
  await generateInfoSection(
    pdf, 
    property, 
    settings, 
    margin + leftColumnWidth, 
    rightColumnWidth, 
    margin, 
    mainContentHeight
  );
  
  // Generate the contact section at the bottom (full width)
  await generateContactSection(
    pdf,
    property,
    settings,
    margin,
    contentWidth,
    margin + mainContentHeight + 10,
    contactSectionHeight
  );
};
