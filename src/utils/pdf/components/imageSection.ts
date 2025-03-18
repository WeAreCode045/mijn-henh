
import { PropertyImage } from "@/types/property";
import { getImageUrl } from "@/utils/imageTypeConverters";

// Helper to convert string or object to a PropertyImage array
function normalizeImages(images: string[] | PropertyImage[] | undefined): PropertyImage[] {
  if (!images) return [];
  
  return images.map(img => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        url: img,
        type: "image" as const
      };
    }
    return img;
  });
}

// Creates the image gallery section for the PDF
export const createImageSection = (
  pdf: any,
  property: any,
  x: number,
  width: number,
  y: number,
  height: number
) => {
  // Extract and normalize images
  const images = property.images || [];
  const propertyImages: PropertyImage[] = normalizeImages(images);
  
  if (propertyImages.length === 0) {
    return;
  }
  
  // Use the main image (featuredImage) if available
  const mainImageUrl = property.featuredImage || 
                      (property.featuredImages && property.featuredImages.length > 0 ? 
                        getImageUrl(property.featuredImages[0]) : null) ||
                      (propertyImages.length > 0 ? getImageUrl(propertyImages[0]) : null);
  
  if (!mainImageUrl) {
    return;
  }
  
  // Add main image
  const imageHeight = height * 0.6;
  pdf.addImage(mainImageUrl, 'JPEG', x, y, width, imageHeight);
  
  // Add smaller images in a grid below
  const smallImagesY = y + imageHeight + 10;
  const smallImageHeight = (height - imageHeight - 10) / 2;
  const smallImageWidth = width / 2 - 2;
  
  // Draw smaller images (up to 4)
  const smallImages = propertyImages.slice(1, 5);
  smallImages.forEach((img, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const imageX = x + col * (smallImageWidth + 4);
    const imageY = smallImagesY + row * (smallImageHeight + 4);
    
    pdf.addImage(
      getImageUrl(img),
      'JPEG',
      imageX,
      imageY,
      smallImageWidth,
      smallImageHeight
    );
  });
};
