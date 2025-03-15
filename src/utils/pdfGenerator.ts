
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
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
    
    // ===== LEFT SIDE - IMAGES =====
    
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
    
    // Left side width (half of content area)
    const leftSideWidth = contentWidth / 2 - 5;
    
    // Draw main image (top half of left side)
    if (mainImage) {
      const mainImgX = margin;
      const mainImgY = margin;
      const mainImgWidth = leftSideWidth;
      const mainImgHeight = (pageHeight - (margin * 2)) / 2;
      
      try {
        pdf.addImage(mainImage, 'JPEG', mainImgX, mainImgY, mainImgWidth, mainImgHeight);
      } catch (error) {
        console.error('Error adding main image:', error);
      }
    }
    
    // Draw 2x2 grid of featured images (bottom half of left side)
    if (featuredImages.length > 0) {
      const gridStartY = margin + (pageHeight - (margin * 2)) / 2 + 5;
      const cellWidth = leftSideWidth / 2 - 2.5;
      const cellHeight = (pageHeight - gridStartY - margin) / 2 - 2.5;
      
      featuredImages.slice(0, 4).forEach((img, index) => {
        if (!img) return;
        const row = Math.floor(index / 2);
        const col = index % 2;
        const imgX = margin + (col * (cellWidth + 5));
        const imgY = gridStartY + (row * (cellHeight + 5));
        
        try {
          pdf.addImage(img, 'JPEG', imgX, imgY, cellWidth, cellHeight);
        } catch (error) {
          console.error(`Error adding featured image ${index}:`, error);
        }
      });
    }
    
    // ===== RIGHT SIDE - CONTENT =====
    
    // Right side starting position and width
    const rightSideX = margin + leftSideWidth + 10;
    const rightSideWidth = leftSideWidth;
    
    // Top bar with title and price
    pdf.setFillColor(primaryColor);
    pdf.rect(rightSideX, margin, rightSideWidth, 20, 'F');
    
    // Title and price text
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    
    // Add title (left aligned)
    const title = property.title || 'Property Details';
    pdf.text(title, rightSideX + 10, margin + 13);
    
    // Add price if available (right aligned)
    if (property.price) {
      pdf.setFontSize(14);
      const priceX = rightSideX + rightSideWidth - 10 - pdf.getTextWidth(property.price);
      pdf.text(property.price, priceX, margin + 13);
    }
    
    // Property specs section with icons (2x3 grid)
    const specsStartY = margin + 30;
    const specs = [
      { label: 'Build Year', value: property.buildYear || 'N/A', icon: 'calendar' },
      { label: 'Plot Size', value: `${property.sqft || 'N/A'} m²`, icon: 'ruler' },
      { label: 'Living Area', value: `${property.livingArea || 'N/A'} m²`, icon: 'home' },
      { label: 'Bedrooms', value: property.bedrooms || 'N/A', icon: 'bed' },
      { label: 'Bathrooms', value: property.bathrooms || 'N/A', icon: 'bath' },
      { label: 'Energy Class', value: property.energyLabel || 'N/A', icon: 'zap' }
    ];
    
    // Calculate spec card dimensions (2x3 grid)
    const cols = 2;
    const rows = 3;
    const specWidth = rightSideWidth / cols - 5;
    const specHeight = 40;
    const specMargin = 5;
    
    specs.forEach((spec, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      const specX = rightSideX + (col * (specWidth + specMargin));
      const specY = specsStartY + (row * (specHeight + specMargin));
      
      // Background
      pdf.setFillColor(primaryColor);
      pdf.roundedRect(specX, specY, specWidth, specHeight, 3, 3, 'F');
      
      // Circle for icon
      pdf.setFillColor(secondaryColor);
      pdf.circle(specX + 15, specY + 15, 10, 'F');
      
      // Label and value
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text(spec.label, specX + 35, specY + 15);
      
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text(String(spec.value), specX + 35, specY + 30);
    });
    
    // Description and features section (starts after specs)
    const textSectionY = specsStartY + (rows * (specHeight + specMargin)) + 10;
    const textSectionHeight = pageHeight - textSectionY - 30; // Leave 30mm for bottom bar
    
    // Description (left half of bottom right)
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(rightSideX, textSectionY, rightSideWidth / 2 - 5, textSectionHeight, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    pdf.text('Description', rightSideX + 10, textSectionY + 15);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const description = property.description || 'No description available.';
    const splitDescription = pdf.splitTextToSize(description, rightSideWidth / 2 - 25);
    pdf.text(splitDescription, rightSideX + 10, textSectionY + 25);
    
    // Features (right half of bottom right)
    pdf.setFillColor(secondaryColor);
    pdf.roundedRect(rightSideX + rightSideWidth / 2 + 5, textSectionY, rightSideWidth / 2 - 5, textSectionHeight, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Features', rightSideX + rightSideWidth / 2 + 15, textSectionY + 15);
    
    pdf.setFontSize(10);
    if (property.features && property.features.length > 0) {
      property.features.slice(0, 12).forEach((feature, index) => {
        const featureY = textSectionY + 30 + (index * 15);
        
        if (featureY < textSectionY + textSectionHeight - 10) {
          pdf.text(`• ${feature.description}`, rightSideX + rightSideWidth / 2 + 15, featureY);
        }
      });
    } else {
      pdf.text('No features available.', rightSideX + rightSideWidth / 2 + 15, textSectionY + 30);
    }
    
    // Bottom bar with contact info and QR code
    const bottomBarY = pageHeight - 20;
    pdf.setFillColor(primaryColor);
    pdf.rect(0, bottomBarY, pageWidth, 20, 'F');
    
    // Contact information
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    
    // Email address (if available)
    if (settings?.email) {
      pdf.text(`Email: ${settings.email}`, margin, bottomBarY + 13);
    }
    
    // Phone number (if available)
    if (settings?.phone) {
      const phoneText = `Phone: ${settings.phone}`;
      const phoneX = margin + 100; // Position after email
      pdf.text(phoneText, phoneX, bottomBarY + 13);
    }
    
    // QR Code for web view
    try {
      const webViewUrl = `${window.location.origin}/property/${property.id}/view`;
      const qrCodeDataUrl = await QRCode.toDataURL(webViewUrl, { 
        width: 15,
        margin: 0,
        color: {
          dark: '#FFFFFF',
          light: primaryColor
        }
      });
      
      // Position QR code on the right side of the bottom bar
      const qrCodeX = pageWidth - margin - 15; // 15mm from right edge
      const qrCodeY = bottomBarY + 2.5; // 2.5mm from bottom bar top
      const qrCodeSize = 15;
      
      pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
      
      // Add "Scan for web view" text
      pdf.setFontSize(8);
      const scanText = "Scan for web view";
      const textWidth = pdf.getTextWidth(scanText);
      const textX = qrCodeX + (qrCodeSize - textWidth) / 2;
      pdf.text(scanText, textX, qrCodeY - 2);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
    
    // Open PDF in a new window
    window.open(pdf.output('bloburl'), '_blank');
    
    return pdf.output('datauristring');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
