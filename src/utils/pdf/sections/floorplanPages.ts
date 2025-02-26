
import jsPDF from 'jspdf';
import { AgencySettings } from '@/types/agency';
import { BROCHURE_STYLES } from '../constants/styles';
import { addHeaderFooter } from '../utils/pageUtils';

export const generateFloorplanPages = async (
  pdf: jsPDF,
  floorplans: string[],
  settings: AgencySettings,
  currentPage: number,
  totalPages: number,
  propertyTitle: string
): Promise<number> => {
  let pageNum = currentPage;
  pdf.addPage();
  pageNum++;
  addHeaderFooter(pdf, pageNum, totalPages, settings, propertyTitle);

  const { margin } = BROCHURE_STYLES.spacing;
  let yPos = 50;

  // Floorplans title
  pdf.setFillColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
  pdf.rect(margin, yPos, 3, 20, 'F');
  
  pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
  pdf.setFontSize(18);
  pdf.text('Plattegronden', margin + 10, yPos + 15);

  // Add floorplan images
  yPos += 40;
  for (const floorplan of floorplans) {
    try {
      const img = new Image();
      img.src = floorplan;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const maxWidth = 180;
      const maxHeight = 130;
      
      const imgAspectRatio = img.width / img.height;
      let finalWidth = maxWidth;
      let finalHeight = finalWidth / imgAspectRatio;
      
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = finalHeight * imgAspectRatio;
      }

      const xOffset = (BROCHURE_STYLES.pageSize.width - finalWidth) / 2;
      pdf.addImage(img, 'JPEG', xOffset, yPos, finalWidth, finalHeight);
      yPos += finalHeight + 10;

      if (yPos > BROCHURE_STYLES.pageSize.height - 40) {
        pdf.addPage();
        pageNum++;
        addHeaderFooter(pdf, pageNum, totalPages, settings, propertyTitle);
        yPos = 50;
      }
    } catch (error) {
      console.error('Error loading floorplan:', error);
    }
  }

  return pageNum;
};
