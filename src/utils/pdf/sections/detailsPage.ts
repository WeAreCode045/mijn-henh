
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { BROCHURE_STYLES } from '../constants/styles';
import { addHeaderFooter, getContentArea, startNewPageIfNeeded } from '../utils/pageUtils';

export const generateDetailsPage = async (
  pdf: jsPDF,
  property: PropertyData,
  settings: AgencySettings,
  currentPage: number,
  totalPages: number
): Promise<void> => {
  pdf.addPage();
  addHeaderFooter(pdf, currentPage, totalPages, settings, property.title);

  const { margin, gutter } = BROCHURE_STYLES.spacing;
  const contentWidth = BROCHURE_STYLES.pageSize.width - (margin * 2);
  let yPos = getContentArea().top;

  // Property highlights
  const highlights = [
    { label: 'Woonoppervlakte', value: `${property.livingArea} m²` },
    { label: 'Perceeloppervlakte', value: `${property.sqft} m²` },
    { label: 'Slaapkamers', value: property.bedrooms },
    { label: 'Badkamers', value: property.bathrooms },
    { label: 'Bouwjaar', value: property.buildYear },
    { label: 'Garages', value: property.garages }
  ].filter(item => item.value);

  const highlightWidth = (contentWidth - (gutter * 2)) / 3;

  highlights.forEach((highlight, index) => {
    const xPos = margin + (index % 3) * (highlightWidth + gutter);
    if (index > 0 && index % 3 === 0) {
      yPos += 40;
      const { newPage, newY } = startNewPageIfNeeded(pdf, yPos, settings, currentPage, totalPages, property.title);
      currentPage = newPage;
      yPos = newY;
    }

    pdf.setFillColor(BROCHURE_STYLES.colors.neutral);
    pdf.roundedRect(xPos, yPos, highlightWidth, 30, 3, 3, 'F');

    pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
    pdf.setFontSize(10);
    pdf.text(highlight.label, xPos + 10, yPos + 12);

    pdf.setTextColor(BROCHURE_STYLES.colors.text.primary);
    pdf.setFontSize(12);
    pdf.setFont(BROCHURE_STYLES.fonts.heading, 'bold');
    pdf.text(String(highlight.value), xPos + 10, yPos + 25);
  });

  // Description section
  yPos += 60;
  const { newPage, newY } = startNewPageIfNeeded(pdf, yPos, settings, currentPage, totalPages, property.title);
  currentPage = newPage;
  yPos = newY;

  pdf.setFontSize(20);
  pdf.setTextColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
  pdf.text('Omschrijving', margin, yPos);

  yPos += 15;
  pdf.setFontSize(11);
  pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
  const description = pdf.splitTextToSize(property.description, contentWidth);
  pdf.text(description, margin, yPos);

  // Features section
  yPos += description.length * 7 + 30;
  const result = startNewPageIfNeeded(pdf, yPos, settings, currentPage, totalPages, property.title);
  yPos = result.newY;
  currentPage = result.newPage;

  // Ensure features is an array before checking length and iterating
  const features = Array.isArray(property.features) ? property.features : 
                  (property.features ? [property.features] : []);
                  
  if (features.length > 0) {
    pdf.setFontSize(20);
    pdf.setTextColor(settings.primaryColor || BROCHURE_STYLES.colors.primary);
    pdf.text('Kenmerken', margin, yPos);

    yPos += 15;
    pdf.setFontSize(11);
    pdf.setTextColor(BROCHURE_STYLES.colors.text.secondary);
    
    features.forEach((feature, index) => {
      if (index > 0 && index % 3 === 0) {
        yPos += 20;
        const pageCheck = startNewPageIfNeeded(pdf, yPos, settings, currentPage, totalPages, property.title);
        yPos = pageCheck.newY;
        currentPage = pageCheck.newPage;
      }
      const xPos = margin + (index % 3) * (highlightWidth + gutter);
      pdf.text(`• ${feature.description}`, xPos, yPos);
    });
  }
};
