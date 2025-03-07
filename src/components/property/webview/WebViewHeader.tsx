
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { formatPrice } from "@/utils/formatters";

interface WebViewHeaderProps {
  property: PropertyData;
  settings: AgencySettings;
}

export function WebViewHeader({ property, settings }: WebViewHeaderProps) {
  // Format the price for display
  const formattedPrice = formatPrice(property.price);
  
  return (
    <div className="webview-header">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="webview-property-title">{property.title}</h1>
          <p className="webview-property-subtitle">{property.address}</p>
        </div>
        
        <div className="webview-property-price" style={{ color: settings?.secondaryColor }}>
          {formattedPrice}
        </div>
      </div>
    </div>
  );
}

// Helper function to format price
function formatPrice(price?: string | number): string {
  if (!price) return '';
  
  // Convert to string and remove non-numeric characters except decimal point
  const numericPrice = price.toString().replace(/[^\d.]/g, '');
  
  // Parse as float
  const parsedPrice = parseFloat(numericPrice);
  
  // Check if it's a valid number
  if (isNaN(parsedPrice)) return '';
  
  // Format with commas for thousands
  return '€ ' + parsedPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}
