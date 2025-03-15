
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
      pdf.addImage(mainImage, 'JPEG', x, y, width, mainImageHeight);
    } catch (error) {
      console.error('Error adding main image:', error);
    }
  }
  
  // Draw featured images (bottom) in a single row
  if (featuredImages.length > 0) {
    const featuredImagesY = y + mainImageHeight + 5;
    const maxFeaturedImages = 3; // Show up to 3 featured images in a row
    const cellWidth = width / maxFeaturedImages - 3;
    const cellHeight = featuredImagesHeight - 5;
    
    featuredImages.slice(0, maxFeaturedImages).forEach((img, index) => {
      if (!img) return;
      const imgX = x + (index * (cellWidth + 4));
      
      try {
        pdf.addImage(img, 'JPEG', imgX, featuredImagesY, cellWidth, cellHeight);
      } catch (error) {
        console.error(`Error adding featured image ${index}:`, error);
      }
    });
  }
};
