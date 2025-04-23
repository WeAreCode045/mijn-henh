
import { PropertyData } from "@/types/property";
import { WebViewSectionProps } from "../types";

export function FeaturesSection({ property, settings }: WebViewSectionProps) {
  // Ensure features is always an array
  const features = Array.isArray(property.features) ? property.features : 
                  (property.features ? [property.features] : []);
  
  if (features.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No features available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-estate-800">Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div 
            key={feature.id || index}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="w-2 h-2 bg-estate-600 rounded-full" />
            <span className="text-gray-700">{feature.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
