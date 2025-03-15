
import { PropertyData } from '@/types/property';
import jsPDF from 'jspdf';
import { safelyGetImageUrl, normalizeImageCollection } from '../../imageHandlers';

export const generateLeftSide = async (
  pdf: jsPDF,
  property: PropertyData,
  margin: number,
  contentWidth: number,
  pageHeight: number,
  bottomBarHeight: number,
  bottomMargin: number
) => {
  // Left side width (half of content area)
  const leftSideWidth = contentWidth / 2 - 5;
  
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
  
  // Draw main image (top half of left side)
  if (mainImage) {
    const mainImgX = margin;
    const mainImgY = margin;
    const mainImgWidth = leftSideWidth;
    const mainImgHeight = (pageHeight - (margin * 2) - bottomBarHeight - bottomMargin) / 2;
    
    try {
      pdf.addImage(mainImage, 'JPEG', mainImgX, mainImgY, mainImgWidth, mainImgHeight);
    } catch (error) {
      console.error('Error adding main image:', error);
    }
  }
  
  // Draw 2x2 grid of featured images (bottom half of left side)
  if (featuredImages.length > 0) {
    const gridStartY = margin + (pageHeight - (margin * 2) - bottomBarHeight - bottomMargin) / 2 + 5;
    const cellWidth = leftSideWidth / 2 - 2.5;
    const cellHeight = (pageHeight - gridStartY - margin - bottomBarHeight - bottomMargin) / 2 - 2.5;
    
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
};
