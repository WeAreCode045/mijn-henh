
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { BROCHURE_STYLES } from '../constants/styles';
import { addHeaderFooter, getContentArea } from '../utils/pageUtils';

export const generateLocationPage = async (
  pdf: jsPDF,
  property: PropertyData,
  settings: AgencySettings,
  currentPage: number,
  totalPages: number,
  propertyTitle: string
): Promise<number> => {
  if (!property.location_description && !property.map_image && !property.nearby_places?.length) {
    return currentPage;
  }

  let pageNum = currentPage;
  pdf.addPage();
  pageNum++;
  addHeaderFooter(pdf, pageNum, totalPages, settings, propertyTitle);

  const { margin } = BROCHURE_STYLES.spacing;
  let yPos = getContentArea().top;

  // Location title
  pdf.setFillColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
  pdf.rect(margin, yPos, 3, 20, 'F');
  
  pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
  pdf.setFontSize(18);
  pdf.text('Locatie', margin + 10, yPos + 15);

  // Location description
  if (property.location_description) {
    yPos += 40;
    pdf.setFontSize(11);
    pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
    const description = pdf.splitTextToSize(property.location_description, 170);
    pdf.text(description, margin, yPos);
    yPos += description.length * 7 + 20;
  }

  // Map image
  if (property.map_image) {
    try {
      const img = new Image();
      img.src = property.map_image;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const maxWidth = 170;
      const maxHeight = 100;
      
      const imgAspectRatio = img.width / img.height;
      let finalWidth = maxWidth;
      let finalHeight = finalWidth / imgAspectRatio;
      
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = finalHeight * imgAspectRatio;
      }

      const xOffset = (BROCHURE_STYLES.pageSize.width - finalWidth) / 2;
      pdf.addImage(img, 'JPEG', xOffset, yPos, finalWidth, finalHeight);
      yPos += finalHeight + 20;
    } catch (error) {
      console.error('Error loading map image:', error);
    }
  }

  // Nearby places
  if (property.nearby_places?.length) {
    pdf.setFontSize(16);
    pdf.setTextColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
    pdf.text('Voorzieningen in de buurt', margin, yPos);
    yPos += 20;

    const placesByType: { [key: string]: any[] } = {};
    property.nearby_places.forEach(place => {
      if (!placesByType[place.type]) {
        placesByType[place.type] = [];
      }
      placesByType[place.type].push(place);
    });

    Object.entries(placesByType).forEach(([type, places]) => {
      pdf.setFontSize(14);
      pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
      pdf.text(type.replace('_', ' '), margin, yPos);
      yPos += 15;

      places.forEach(place => {
        pdf.setFontSize(11);
        pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
        pdf.text(`• ${place.name}`, margin + 10, yPos);
        if (place.vicinity) {
          pdf.setFontSize(9);
          yPos += 10;
          pdf.text(place.vicinity, margin + 15, yPos);
        }
        yPos += 15;
      });
      yPos += 10;
    });
  }

  return pageNum;
};
