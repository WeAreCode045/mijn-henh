
import { WebViewSectionProps } from "../types";

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

  return (
    <div className="space-y-4 pb-24">
      <div className="space-y-4 mt-2">
        {property.images && property.images.length > 0 && (
          <>
            <div className="relative px-6">
              <img
                src={property.images[0].url}
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
      </div>
    </div>
  );
}
