import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { safelyGetImageUrl, normalizeImageCollection } from './imageHandlers';

export const generatePropertyPDF = async (property: PropertyData, settings: AgencySettings, templateId?: string) => {
  try {
    // Create a new PDF document in landscape orientation
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Define colors
    const primaryColor = settings?.primaryColor || '#9b87f5';
    const secondaryColor = settings?.secondaryColor || '#7E69AB';
    
    // Define dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    // Add header with agency logo
    if (settings?.logoUrl) {
      try {
        pdf.addImage(settings.logoUrl, 'PNG', margin, margin, 50, 20);
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        const contactInfo = [
          settings.name,
          settings.phone,
          settings.email
        ].filter(Boolean).join(' | ');
        pdf.text(contactInfo, margin + 55, margin + 15);
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }
    
    // Get the main image and featured images
    const mainImage = safelyGetImageUrl(property.featuredImage) || 
                     (property.images && property.images.length > 0 ? 
                      safelyGetImageUrl(property.images[0]) : null);
                      
    // Get featured images
    const normalizedImages = normalizeImageCollection(property.images);
    let featuredImages = normalizedImages
      .filter(img => img.is_featured_image)
      .map(img => img.url || '');
    
    if (featuredImages.length === 0 && property.featuredImages) {
      featuredImages = property.featuredImages.slice(0, 4);
    }
    
    // Make sure we have at least some images
    if (featuredImages.length === 0 && normalizedImages.length > 0) {
      featuredImages = normalizedImages.slice(0, 4).map(img => img.url || '');
    }
    
    // Draw main image (left half of the page)
    if (mainImage) {
      const mainImgX = margin;
      const mainImgY = margin + 30;
      const mainImgWidth = contentWidth / 2 - 5;
      const mainImgHeight = pageHeight / 2 - mainImgY - 10;
      
      try {
        pdf.addImage(mainImage, 'JPEG', mainImgX, mainImgY, mainImgWidth, mainImgHeight);
      } catch (error) {
        console.error('Error adding main image:', error);
      }
    }
    
    // Draw 2x2 grid of featured images (right half of the page)
    if (featuredImages.length > 0) {
      const gridX = margin + contentWidth / 2 + 5;
      const gridY = margin + 30;
      const cellWidth = contentWidth / 4 - 5;
      const cellHeight = (pageHeight / 2 - gridY - 10) / 2;
      
      featuredImages.slice(0, 4).forEach((img, index) => {
        if (!img) return;
        const row = Math.floor(index / 2);
        const col = index % 2;
        const imgX = gridX + (col * (cellWidth + 5));
        const imgY = gridY + (row * (cellHeight + 5));
        
        try {
          pdf.addImage(img, 'JPEG', imgX, imgY, cellWidth, cellHeight);
        } catch (error) {
          console.error(`Error adding featured image ${index}:`, error);
        }
      });
    }
    
    // Property specs section with icons
    const specsY = pageHeight / 2 + 10;
    const specs = [
      { label: 'Build Year', value: property.buildYear || 'N/A', icon: settings?.iconBuildYear || 'calendar' },
      { label: 'Plot Size', value: `${property.sqft || 'N/A'} m²`, icon: settings?.iconSqft || 'ruler' },
      { label: 'Living Area', value: `${property.livingArea || 'N/A'} m²`, icon: settings?.iconLivingSpace || 'home' },
      { label: 'Bedrooms', value: property.bedrooms || 'N/A', icon: settings?.iconBedrooms || 'bed' },
      { label: 'Bathrooms', value: property.bathrooms || 'N/A', icon: settings?.iconBathrooms || 'bath' },
      { label: 'Energy Class', value: property.energyLabel || 'N/A', icon: settings?.iconEnergyClass || 'zap' }
    ];
    
    const specWidth = contentWidth / specs.length;
    
    specs.forEach((spec, index) => {
      const specX = margin + (index * specWidth);
      
      // Background
      pdf.setFillColor(primaryColor);
      pdf.roundedRect(specX, specsY, specWidth - 5, 40, 3, 3, 'F');
      
      // Circle for icon
      pdf.setFillColor(secondaryColor);
      pdf.circle(specX + 15, specsY + 15, 10, 'F');
      
      // Label and value
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text(spec.label, specX + 35, specsY + 15);
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text(String(spec.value), specX + 35, specsY + 30);
    });
    
    // Description and features section
    const descY = specsY + 50;
    const descHeight = pageHeight - descY - 30;
    
    // Description (left)
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, descY, contentWidth / 2 - 5, descHeight, 3, 3, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(80, 80, 80);
    pdf.text('Description', margin + 10, descY + 15);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const description = property.description || 'No description available.';
    const splitDescription = pdf.splitTextToSize(description, contentWidth / 2 - 25);
    pdf.text(splitDescription, margin + 10, descY + 25);
    
    // Features (right)
    pdf.setFillColor(secondaryColor);
    pdf.roundedRect(margin + contentWidth / 2 + 5, descY, contentWidth / 2 - 5, descHeight, 3, 3, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Features', margin + contentWidth / 2 + 15, descY + 15);
    
    pdf.setFontSize(10);
    if (property.features && property.features.length > 0) {
      property.features.slice(0, 12).forEach((feature, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const featureX = margin + contentWidth / 2 + 15 + (col * 85);
        const featureY = descY + 30 + (row * 15);
        
        pdf.text(`• ${feature.description}`, featureX, featureY);
      });
    } else {
      pdf.text('No features available.', margin + contentWidth / 2 + 15, descY + 30);
    }
    
    // Bottom bar with title and price
    const bottomBarY = pageHeight - 20;
    pdf.setFillColor(primaryColor);
    pdf.rect(0, bottomBarY, pageWidth, 20, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text(property.title || 'Property Details', margin, bottomBarY + 14);
    
    if (property.price) {
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text(property.price, pageWidth - margin - pdf.getTextWidth(property.price), bottomBarY + 14);
    }
    
    // Open PDF in a new window
    window.open(pdf.output('bloburl'), '_blank');
    
    return pdf.output('datauristring');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
