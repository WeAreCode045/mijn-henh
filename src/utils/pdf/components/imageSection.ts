
import { PropertyData } from '@/types/property';
import jsPDF from 'jspdf';
import { safelyGetImageUrl, normalizeImageCollection } from '../../imageHandlers';

export const generateImageSection = async (
  pdf: jsPDF,
  property: PropertyData,
  x: number,
  width: number,
  y: number,
  height: number
) => {
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
  
  // Draw main image (larger, on the left)
  if (mainImage) {
    const mainImgX = x;
    const mainImgY = y;
    const mainImgWidth = width * 0.5;
    const mainImgHeight = height;
    
    try {
      pdf.addImage(mainImage, 'JPEG', mainImgX, mainImgY, mainImgWidth, mainImgHeight);
    } catch (error) {
      console.error('Error adding main image:', error);
    }
  }
  
  // Draw 2x2 grid of featured images (right side)
  if (featuredImages.length > 0) {
    const gridStartX = x + width * 0.5 + 5;
    const gridWidth = width * 0.5 - 5;
    const cellWidth = gridWidth / 2 - 2.5;
    const cellHeight = height / 2 - 2.5;
    
    featuredImages.slice(0, 4).forEach((img, index) => {
      if (!img) return;
      const row = Math.floor(index / 2);
      const col = index % 2;
      const imgX = gridStartX + (col * (cellWidth + 5));
      const imgY = y + (row * (cellHeight + 5));
      
      try {
        pdf.addImage(img, 'JPEG', imgX, imgY, cellWidth, cellHeight);
      } catch (error) {
        console.error(`Error adding featured image ${index}:`, error);
      }
    });
  }
};
