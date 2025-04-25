
import { WebViewSectionProps } from "../types";
import "../styles/WebViewStyles.css";

export function OverviewSection({ property, settings }: WebViewSectionProps) {
  // Format price with thousand separators
  const formatPrice = (price?: string | number): string => {
    if (price === undefined || price === null) return "€ 0";
    
    // Convert string to number if needed
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/\D/g, '')) : price;
    
    // Handle NaN case
    if (isNaN(numericPrice)) return "€ 0";
    
    // Format with thousand separators
    return "€ " + numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  console.log("OverviewSection rendering with property:", property);
  console.log("Featured image:", property.featuredImage);
  console.log("Featured images:", property.featuredImages);

  // Get the image to display (main image, first featured image, or first regular image)
  let mainImage = property.featuredImage;
  
  // If no featuredImage directly, try to get from featuredImages array
  if (!mainImage && property.featuredImages && Array.isArray(property.featuredImages) && property.featuredImages.length > 0) {
    mainImage = property.featuredImages[0];
  }
  
  // If still no image, try to get from regular images
  if (!mainImage && property.images && Array.isArray(property.images) && property.images.length > 0) {
    const firstImage = property.images[0];
    if (typeof firstImage === 'string') {
      mainImage = firstImage;
    } else if (typeof firstImage === 'object' && firstImage && 'url' in firstImage) {
      mainImage = firstImage.url;
    }
  }

  // Get featured images array, ensuring we have an array even if it's empty
  let featuredImages: string[] = [];
  
  if (property.featuredImages && Array.isArray(property.featuredImages)) {
    featuredImages = property.featuredImages;
  }

  console.log("Selected main image for display:", mainImage);
  console.log("Featured images count:", featuredImages.length);

  return (
    <div className="space-y-4 pb-24 overflow-y-hidden">
      <div className="space-y-4 mt-2">
        {/* Blue bar with title and price (now ABOVE the image) */}

        
      
        {mainImage && (
          <div className="relative px-6">
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-[450px] object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
            
        {/* Featured images grid - Always display if we have any */}
        {featuredImages.length > 0 && (
          <div className="px-6 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {featuredImages.slice(0, 4).map((imageUrl, index) => (
                <div key={index} className="rounded-md overflow-hidden h-[100px]">
                  <img 
                    src={imageUrl} 
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}        
      </div>
    </div>
  );
}
