
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
  
  // Calculate heights - enforce 3:4 ratio for main image
  const mainImageHeight = height * 0.5; // 60% for main image
  
  // Fix 3:4 ratio for main image width (height is fixed, adjust width to maintain ratio)
  const mainImageRatio = 4/3; // width:height ratio of 3:4
  const mainImageWidth = mainImageHeight * mainImageRatio;
  
  // Center the main image if it's narrower than the available width
  const mainImageX = mainImageWidth < width ? x + ((width - mainImageWidth) / 2) : x;
  
  // Featured images section takes remaining height
  const featuredImagesHeight = height * 0.5; // 40% for featured images
  
  // Draw main image (top)
  if (mainImage) {
    try {
      // Use correct image dimensions to maintain 3:4 aspect ratio
      pdf.addImage(mainImage, 'JPEG', mainImageX, y, mainImageWidth, mainImageHeight);
    } catch (error) {
      console.error('Error adding main image:', error);
    }
  }
  
  // Draw featured images (bottom) in a 2x2 grid
  if (featuredImages.length > 0) {
    const featuredImagesY = y + mainImageHeight + 2; // Small gap after main image
    const maxFeaturedImages = 4; // Show up to 4 featured images in a 2x2 grid
    const gridCols = 2;
    const gridRows = 2;
    const gapSize = 2; // Gap between images in the grid
    
    // Calculate cell dimensions with gaps
    const cellWidth = (width - gapSize) / gridCols;
    const cellHeight = (featuredImagesHeight - gapSize) / gridRows;
    
    featuredImages.slice(0, maxFeaturedImages).forEach((img, index) => {
      if (!img) return;
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      
      // Calculate position with gaps
      const imgX = x + (col * (cellWidth + gapSize));
      const imgY = featuredImagesY + (row * (cellHeight + gapSize));
      
      try {
        pdf.addImage(img, 'JPEG', imgX, imgY, cellWidth, cellHeight);
      } catch (error) {
        console.error(`Error adding featured image ${index}:`, error);
      }
    });
  }
};
