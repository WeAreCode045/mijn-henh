
import jsPDF from 'jspdf';
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { generateCoverPage } from '../sections/coverPage';
import { generateDetailsPage } from '../sections/detailsPage';
import { generateAreaPages } from '../sections/areaPages';
import { generateContactPage } from '../sections/contactPage';
import { generateLocationPage } from '../sections/locationPage';

export async function generatePropertyBrochure(
  property: PropertyData,
  settings: AgencySettings,
  propertyImages: string[],
  featuredImageUrl: string | null,
  description_background_url?: string,
  locationImageUrl?: string,
  contactImageUrl?: string
): Promise<jsPDF> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Calculate total pages
  const totalPages = property.areas && property.areas.length > 0 ? 
    Math.ceil(property.areas.length / 2) + 6 : 6;

  // Generate pages
  await generateCoverPage(pdf, property, totalPages);
  await generateDetailsPage(pdf, property, settings, 2, totalPages); // Pass current page number

  if (property.areas && property.areas.length > 0) {
    await generateAreaPages(
      pdf,
      property.areas,
      property.images,
      settings,
      3,
      totalPages,
      property.title
    );
  }

  await generateLocationPage(
    pdf,
    property,
    settings,
    4,
    totalPages,
    property.title
  );

  await generateContactPage(
    pdf,
    settings,
    5,
    totalPages,
    property.title
  );

  return pdf;
}
