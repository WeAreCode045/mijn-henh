
import jsPDF from 'jspdf';
import { AgencySettings } from '@/types/agency';
import { PropertyData } from '@/types/property';
import { BROCHURE_STYLES } from '../constants/styles';

export const getContentArea = () => {
  const { headerHeight, footerHeight, contentArea } = BROCHURE_STYLES.spacing;
  const { height } = BROCHURE_STYLES.pageSize;
  
  return {
    top: headerHeight + contentArea.top,
    bottom: height - footerHeight - contentArea.bottom,
    height: height - headerHeight - footerHeight - contentArea.top - contentArea.bottom
  };
};

export const isContentOverflowing = (currentY: number): boolean => {
  const { bottom } = getContentArea();
  return currentY >= bottom;
};

export const addHeaderFooter = (
  pdf: jsPDF,
  pageNum: number,
  totalPages: number,
  settings: AgencySettings,
  propertyTitle: string
): void => {
  const { width, height } = BROCHURE_STYLES.pageSize;
  const { margin, headerHeight, footerHeight } = BROCHURE_STYLES.spacing;

  // Header
  pdf.setFillColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
  pdf.rect(0, 0, width, headerHeight, 'F');

  if (settings.logoUrl) {
    try {
      const img = new Image();
      img.src = settings.logoUrl;
      pdf.addImage(img, 'PNG', margin, 5, 40, 20);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }

  // Contact info in header
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  const contactInfo = [
    settings.name,
    settings.phone,
    settings.email
  ].filter(Boolean).join(' | ');
  pdf.text(contactInfo, margin + 50, 18);

  // Footer
  pdf.setFillColor(settings.secondaryColor || BROCHURE_STYLES.colors.secondary);
  pdf.rect(0, height - footerHeight, width, footerHeight, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text(propertyTitle, margin, height - 8);
  pdf.text(
    `Pagina ${pageNum} van ${totalPages}`,
    width - margin - 20,
    height - 8
  );
};

export const calculateTotalPages = (property: PropertyData): number => {
  let pages = 3; // Cover, details, and contact pages
  if (property.areas?.length) {
    pages += Math.ceil(property.areas.length / 2);
  }
  if (property.floorplans?.length) {
    pages += Math.ceil(property.floorplans.length / 2);
  }
  return pages;
};

export const startNewPageIfNeeded = (
  pdf: jsPDF,
  currentY: number,
  settings: AgencySettings,
  currentPage: number,
  totalPages: number,
  propertyTitle: string
): { newPage: number, newY: number } => {
  if (isContentOverflowing(currentY)) {
    pdf.addPage();
    currentPage++;
    addHeaderFooter(pdf, currentPage, totalPages, settings, propertyTitle);
    return { newPage: currentPage, newY: getContentArea().top };
  }
  return { newPage: currentPage, newY: currentY };
};
