
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import type { Section } from '@/components/brochure/TemplateBuilder';

export const generatePropertyPDF = async (property: PropertyData, settings: AgencySettings, templateId?: string) => {
  try {
    console.log('PDF generation temporarily disabled');
    alert('PDF generation is currently being rebuilt. Please check back later.');
    return null;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
