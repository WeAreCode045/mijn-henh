
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
  const bottomBarHeight = 15;
  const bottomMargin = 10; // Margin between content and bottom bar
  
  // Calculate the available content height (excluding margins and bottom bar)
  const availableHeight = pageHeight - margin * 2 - bottomBarHeight - bottomMargin;
  
  // Key info cards should be more compact
  const cardsHeight = 18; // Reduced height
  const cardsMargin = 5; // Space before and after cards
  
  // Allocate heights for each section
  const imagesHeight = availableHeight * 1; // 68% of available height for images
  const infoSectionHeight = availableHeight - imagesHeight - cardsHeight - (cardsMargin * 2); // Remaining height for info
  
  // Calculate widths for left and right columns
  const leftColumnWidth = contentWidth * 0.4; // 50% for images
  const rightColumnWidth = contentWidth * 0.6; // 50% for title/description/features
  
  // Generate the main image and featured images section (left column)
  await generateImageSection(
    pdf, 
    property, 
    margin, 
    leftColumnWidth, 
    margin, 
    imagesHeight
  );
  
  // Generate the info section (title, description, features) on the right column
  await generateInfoSection(
    pdf, 
    property, 
    settings, 
    margin + leftColumnWidth, 
    rightColumnWidth, 
    margin, 
    imagesHeight // Match height with images section
  );
  
  // Generate the key info cards (full width, at bottom)
  const cardsStartY = margin + imagesHeight + cardsMargin;
  await generateKeyInfoCards(
    pdf, 
    property, 
    settings, 
    margin, 
    contentWidth, 
    cardsStartY, 
    cardsHeight
  );
};
