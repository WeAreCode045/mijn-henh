
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { BROCHURE_STYLES } from '../constants/styles';

export const generateCoverPage = async (
  pdf: jsPDF,
  property: PropertyData,
  currentPage: number
): Promise<void> => {
  const { width, height } = BROCHURE_STYLES.pageSize;

  // Featured image (top half)
  if (property.featuredImage) {
    try {
      const img = new Image();
      img.src = property.featuredImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      pdf.addImage(img, 'JPEG', 0, 0, width, height / 2);

      // Grid images (bottom half)
      const padding = 10; // Add padding
      const gridHeight = height / 4;
      const imageWidth = (width - (padding * 5)) / 4; // Adjust width for padding
      
      for (let i = 0; i < Math.min(4, property.gridImages.length); i++) {
        const img = new Image();
        img.src = property.gridImages[i];
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const xPos = padding + (i * (imageWidth + padding));
        const yPos = (height / 2) + padding;

        pdf.addImage(img, 'JPEG', xPos, yPos, imageWidth, gridHeight - (padding * 2));
      }

      // Gradient overlay for title area
      pdf.setFillColor(0, 0, 0);
      const gState = pdf.setGState({ opacity: 0.7 });
      pdf.rect(0, height - 100, width, 100, 'F');
      pdf.setGState(gState);

      // Property title and price
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.setFont(BROCHURE_STYLES.fonts.heading, 'bold');
      
      const title = pdf.splitTextToSize(property.title, width - 40);
      pdf.text(title, 20, height - 70);

      if (property.price) {
        pdf.setFontSize(24);
        pdf.text(property.price, 20, height - 30);
      }
    } catch (error) {
      console.error('Error loading featured image:', error);
    }
  }
};
