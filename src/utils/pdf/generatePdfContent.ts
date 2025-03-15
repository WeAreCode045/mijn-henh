
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
  const bottomMargin = 5; // Reduced from 10 to minimize space below key info cards
  
  // Calculate the available content height (excluding margins and bottom bar)
  const availableHeight = pageHeight - margin * 2 - bottomBarHeight - bottomMargin;
  
  // Key info cards should be more compact
  const cardsHeight = 15; // Slightly reduced height
  const cardsMargin = 3; // Reduced space before and after cards
  
  // Allocate heights for each section
  const imagesHeight = availableHeight * 0.95; // 95% of available height for images and info sections
  const infoSectionHeight = availableHeight - imagesHeight - cardsHeight - cardsMargin; // Remaining height for info
  
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
  
  // Generate the key info cards (full width, at bottom) - position exactly below the main content
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
