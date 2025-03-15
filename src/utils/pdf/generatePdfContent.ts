
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
  
  // Generate the image section (left half, top)
  const imageHeight = (pageHeight - margin * 2 - bottomBarHeight - bottomMargin) * 0.55;
  await generateImageSection(pdf, property, margin, contentWidth, margin, imageHeight);
  
  // Generate the key info cards (full width, below images)
  const cardsStartY = margin + imageHeight + 10;
  const cardsHeight = 25; // Reduced height for cards
  await generateKeyInfoCards(pdf, property, settings, margin, contentWidth, cardsStartY, cardsHeight);
  
  // Generate the info section (title, description, features)
  const infoSectionY = cardsStartY + cardsHeight + 10;
  const infoSectionHeight = pageHeight - infoSectionY - bottomBarHeight - bottomMargin;
  await generateInfoSection(pdf, property, settings, margin, contentWidth, infoSectionY, infoSectionHeight);
};
