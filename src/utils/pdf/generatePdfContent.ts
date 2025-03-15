
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import { generateLeftSide } from './components/leftSide';
import { generateRightSide } from './components/rightSide';

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
  const bottomMargin = 10; // Add some margin between content and bottom bar
  
  // Generate the left side with images
  await generateLeftSide(pdf, property, margin, contentWidth, pageHeight, bottomBarHeight, bottomMargin);
  
  // Generate the right side with information
  await generateRightSide(pdf, property, settings, margin, contentWidth, pageHeight, bottomBarHeight, bottomMargin);
};
