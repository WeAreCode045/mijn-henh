
import { PropertyDetails } from "../PropertyDetails";
import { WebViewSectionProps } from "../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";
import { PropertyData } from "@/types/property";

// Extended interface to include the featured property
interface ExtendedPropertyData extends PropertyData {
  featured?: Array<{description: string; [key: string]: string | number | boolean | null | undefined}>;
}

export function DetailsSection({ property, settings }: WebViewSectionProps) {
  // Ensure features is always an array
  const features = property.features ? (
    Array.isArray(property.features) ? property.features : [property.features]
  ) : [];
  
  // Get features from the featured JSONB column
  // Cast property to ExtendedPropertyData to access the featured property
  const extendedProperty = property as ExtendedPropertyData;
  const featuredFeatures = extendedProperty.featured ? (
    Array.isArray(extendedProperty.featured) ? extendedProperty.featured : [extendedProperty.featured]
  ) : [];
  
  // Combine both feature sources
  const allFeatures = [
    ...features,
    ...featuredFeatures.map((feature, index) => ({
      id: `featured-${index}`,
      description: feature.description || ''
    }))
  ];
  
  console.log("Properties features:", features);
  console.log("Featured features:", featuredFeatures);
  
  return (
    <div className="space-y-6 pb-16 overflow-y-auto">
      <div className="px-6">
        <PropertyDetails 
          property={property}
          settings={settings}
        />
      </div>
      
      <div className="px-6 py-1 flex flex-col md:flex-row gap-6">
        {/* Description Section */}
        <div className="flex-[3] relative">
          <div className="relative bg-white/90 p-4 rounded-lg shadow-sm">
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: settings?.secondaryColor }}
            >
              Description
            </h3>
            <p className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </div>
        </div>

        {/* Features Section */}
        {allFeatures.length > 0 && (
          <div className="flex-[2]">
            <div className="bg-white/90 p-4 rounded-lg shadow-sm">
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: settings?.secondaryColor }}
              >
                Features
              </h3>
              <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <Table>
                  <TableBody>
                    {allFeatures.map((feature, index) => {
                      const isEven = index % 2 === 0;
                      
                      // Blue/gray for even rows, light gray for odd rows
                      const bgColor = isEven 
                        ? '#e2e8f0' // Tailwind's slate-200 color (blue/gray tint)
                        : '#f3f3f3'; // Light gray
                      
                      return (
                        <TableRow 
                          key={feature.id || index}
                          style={{ 
                            backgroundColor: bgColor,
                            borderBottom: 'none'
                          }}
                        >
                          <TableCell className="p-2 text-gray-700 flex items-center text-left pl-4">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                              style={{ backgroundColor: settings?.secondaryColor || '#0EA5E9' }}
                            >
                              <Check 
                                className="w-4 h-4 text-white"
                                strokeWidth={2.5}
                              />
                            </div>
                            <span style={{ fontWeight: 500 }}>
                              {feature.description}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
