
import { PropertyImage } from "@/types/property";
import { getImageUrl } from "@/utils/typeGuards";
import { toPropertyImageArray } from "@/utils/propertyTypeGuards";

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
export const createImageSection = (images: string[] | PropertyImage[] | undefined) => {
  if (!images || images.length === 0) return null;
  
  // Convert to PropertyImage[]
  const propertyImages: PropertyImage[] = normalizeImages(images);
  
  return {
    stack: [
      {
        text: 'Property Images',
        style: 'heading2',
        margin: [0, 16, 0, 8]
      },
      {
        columns: propertyImages.slice(0, 6).map(img => ({
          stack: [
            {
              image: getImageUrl(img),
              width: 180,
              height: 120,
              fit: [180, 120]
            }
          ],
          width: 'auto',
          margin: [0, 0, 8, 8]
        }))
      }
    ]
  };
};
