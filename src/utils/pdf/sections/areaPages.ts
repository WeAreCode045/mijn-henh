
import jsPDF from 'jspdf';
import { PropertyArea, PropertyImage } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { BROCHURE_STYLES } from '../constants/styles';
import { addHeaderFooter } from '../utils/pageUtils';

export const addAreaImages = async (
  pdf: jsPDF,
  images: PropertyImage[],
  startY: number
): Promise<void> => {
  const { margin, gutter } = BROCHURE_STYLES.spacing;
  const contentWidth = BROCHURE_STYLES.pageSize.width - (margin * 2);
  const imageWidth = (contentWidth - gutter * 2) / 3;
  const imageHeight = imageWidth / BROCHURE_STYLES.imageAspectRatio;

  for (let i = 0; i < images.length; i++) {
    try {
      const img = new Image();
      img.src = images[i].url;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const xPos = margin + (i % 3) * (imageWidth + gutter);
      const yPos = startY + Math.floor(i / 3) * (imageHeight + gutter);

      pdf.addImage(img, 'JPEG', xPos, yPos, imageWidth, imageHeight);
    } catch (error) {
      console.error('Error loading area image:', error);
    }
  }
};

export const generateAreaPages = async (
  pdf: jsPDF,
  areas: PropertyArea[],
  images: PropertyImage[],
  settings: AgencySettings,
  currentPage: number,
  totalPages: number,
  propertyTitle: string
): Promise<number> => {
  let pageNum = currentPage;

  for (const area of areas) {
    if (pageNum % 2 === 0) pdf.addPage();
    pageNum++;
    addHeaderFooter(pdf, pageNum, totalPages, settings, propertyTitle);

    const { margin } = BROCHURE_STYLES.spacing;
    let yPos = 50;

    // Area title
    pdf.setFillColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
    pdf.rect(margin, yPos, 3, 20, 'F');
    
    pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
    pdf.setFontSize(18);
    pdf.text(area.title, margin + 10, yPos + 15);

    // Area description
    yPos += 30;
    pdf.setFontSize(11);
    pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
    const description = pdf.splitTextToSize(area.description, 170);
    pdf.text(description, margin, yPos);

    // Area images in 3 columns
    if (area.imageIds?.length) {
      yPos += description.length * 7 + 10;
      const areaImages = area.imageIds.map(id => images.find(img => img.id === id)).filter(Boolean) as PropertyImage[];
      await addAreaImages(pdf, areaImages, yPos);
    }
  }

  return pageNum;
};
