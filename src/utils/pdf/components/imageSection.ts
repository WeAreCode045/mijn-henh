
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
  
  // Calculate heights
  const mainImageHeight = height * 0.6; // 60% for main image
  const featuredImagesHeight = height * 0.4; // 40% for featured images
  
  // Draw main image (top)
  if (mainImage) {
    try {
      // Use correct image dimensions to maintain aspect ratio
      pdf.addImage(mainImage, 'JPEG', x, y, width, mainImageHeight);
    } catch (error) {
      console.error('Error adding main image:', error);
    }
  }
  
  // Draw featured images (bottom) in a 2x2 grid
  if (featuredImages.length > 0) {
    const featuredImagesY = y + mainImageHeight + 2; // Reduced gap
    const maxFeaturedImages = 4; // Show up to 4 featured images in a 2x2 grid
    const gridCols = 2;
    const gridRows = 2;
    const cellWidth = (width) / gridCols;
    const cellHeight = (featuredImagesHeight) / gridRows;
    
    featuredImages.slice(0, maxFeaturedImages).forEach((img, index) => {
      if (!img) return;
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      const imgX = x + (col * cellWidth);
      const imgY = featuredImagesY + (row * cellHeight);
      
      try {
        // Remove the 1px gap between images for cleaner look
        pdf.addImage(img, 'JPEG', imgX, imgY, cellWidth, cellHeight);
      } catch (error) {
        console.error(`Error adding featured image ${index}:`, error);
      }
    });
  }
};
