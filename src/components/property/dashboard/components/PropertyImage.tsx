
import { PropertyData } from "@/types/property";

interface PropertyImageProps {
  property: PropertyData;
}

export function PropertyImage({ property }: PropertyImageProps) {
  const mainImage = property.featuredImage || (property.images && property.images.length > 0 ? property.images[0].url : null);
  
  return (
    <div className="h-40 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
      {mainImage ? (
        <img 
          src={mainImage} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          No image
        </div>
      )}
    </div>
  );
}
