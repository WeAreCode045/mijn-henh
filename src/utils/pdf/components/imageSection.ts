
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
  
  // Calculate heights - main image takes 50% of total height, grid takes 50%
  const mainImageHeight = height * 0.4; // 50% for main image
  const featuredImagesHeight = height * 0.5; // 50% for featured images grid
  
  // Draw main image (top) with 1.5 aspect ratio (landscape orientation)
  if (mainImage) {
    try {
      // Ensure 1.5 aspect ratio (width:height ratio of 1.5 (landscape)
      const aspectRatio = 1.6;
      
      // Calculate dimensions to maintain aspect ratio
      let imageWidth = width;
      let imageHeight = imageWidth / aspectRatio;
      
      // If calculated height exceeds allocated height, adjust width
      if (imageHeight > mainImageHeight) {
        imageHeight = mainImageHeight;
        imageWidth = imageHeight * aspectRatio;
      }
      
      // Center the image horizontally if it's narrower than the container
      const imageX = imageWidth < width ? x + ((width - imageWidth) / 2) : x;
      
      // Add rounded corners to main image
      pdf.setDrawColor(255, 255, 255);
      pdf.roundedRect(imageX, y, imageWidth, imageHeight, 5, 5, 'F');
      pdf.addImage(mainImage, 'JPEG', imageX, y, imageWidth, imageHeight);
    } catch (error) {
      console.error('Error adding main image:', error);
    }
  }
  
  // Draw featured images (bottom) in a 2x2 grid with the same aspect ratio as main image
  if (featuredImages.length > 0) {
    // Use a smaller gap (1px instead of 2px)
    const featuredImagesY = y + mainImageHeight + 1; // Reduced gap after main image
    const maxFeaturedImages = 4; // Show up to 4 featured images in a 2x2 grid
    const gridCols = 2;
    const gridRows = 2;
    const gapSize = 1; // Reduced gap between images in the grid
    
    // Calculate cell dimensions with gaps
    const cellWidth = (width - gapSize) / gridCols;
    const cellHeight = (featuredImagesHeight - gapSize) / gridRows;
    
    // Apply the same 1.5 aspect ratio to each grid cell
    const aspectRatio = 1.6;
    
    featuredImages.slice(0, maxFeaturedImages).forEach((img, index) => {
      if (!img) return;
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      
      // Calculate position with reduced gaps
      const imgX = x + (col * (cellWidth + gapSize));
      const imgY = featuredImagesY + (row * (cellHeight + gapSize));
      
      // Maintain aspect ratio within each cell
      let imgDisplayWidth = cellWidth;
      let imgDisplayHeight = imgDisplayWidth / aspectRatio;
      
      if (imgDisplayHeight > cellHeight) {
        imgDisplayHeight = cellHeight;
        imgDisplayWidth = imgDisplayHeight * aspectRatio;
      }
      
      // Center the image in its cell
      const centeredImgX = imgX + ((cellWidth - imgDisplayWidth) / 2);
      
      try {
        // Add rounded corners to featured images
        pdf.setDrawColor(255, 255, 255);
        pdf.roundedRect(centeredImgX, imgY, imgDisplayWidth, imgDisplayHeight, 5, 5, 'F');
        pdf.addImage(img, 'JPEG', centeredImgX, imgY, imgDisplayWidth, imgDisplayHeight);
      } catch (error) {
        console.error(`Error adding featured image ${index}:`, error);
      }
    });
  }
};
