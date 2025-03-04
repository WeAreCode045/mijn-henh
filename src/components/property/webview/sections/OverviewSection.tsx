
import { WebViewSectionProps } from "../types";
import { WebViewImageGrid } from "../WebViewImageGrid";

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

  console.log("OverviewSection rendering with featured image:", property.featuredImage);
  console.log("Grid images:", property.gridImages);

  // Get the image to display (featured image, first grid image, or first regular image)
  const mainImage = property.featuredImage || 
                   (property.gridImages && property.gridImages.length > 0 ? property.gridImages[0] : null) ||
                   (property.images && property.images.length > 0 ? 
                     (typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url) : null);

  console.log("Selected main image for display:", mainImage);

  return (
    <div className="space-y-4 pb-24">
      <div className="space-y-4 mt-2">
        {mainImage && (
          <>
            <div className="relative px-6">
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {/* Blue bar with title and price */}
            <div 
              className="mx-6 px-4 py-3 rounded-md flex justify-between items-center"
              style={{ backgroundColor: settings?.primaryColor || '#0EA5E9' }}
            >
              <h2 className="font-semibold text-white text-lg truncate mr-4">
                {property.title}
              </h2>
              <span className="text-white font-bold text-lg whitespace-nowrap">
                {formatPrice(property.price)}
              </span>
            </div>
          </>
        )}
        
        {/* Grid images */}
        {property.gridImages && property.gridImages.length > 0 && (
          <div className="px-6 mt-4">
            <div className="grid grid-cols-2 gap-2">
              {property.gridImages.slice(0, 4).map((imageUrl, index) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden">
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
