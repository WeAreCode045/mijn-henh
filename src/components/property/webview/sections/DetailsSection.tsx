
import { WebViewSectionProps } from "../types";
import { PropertyDetails } from "../PropertyDetails";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";
import { PropertyFeature } from "@/types/property";

export function DetailsSection({ property, settings }: WebViewSectionProps) {
  // Ensure features is processed properly for display
  const features = Array.isArray(property.features) 
    ? property.features.map(feature => {
        // Handle different possible feature formats
        if (typeof feature === 'string') {
          return { id: `feature-${Math.random().toString(36).substring(2, 9)}`, description: feature };
        } 
        else if (typeof feature === 'object' && feature !== null) {
          return { 
            id: feature.id || `feature-${Math.random().toString(36).substring(2, 9)}`,
            description: feature.description || String(feature)
          };
        }
        return { id: `feature-${Math.random().toString(36).substring(2, 9)}`, description: 'Unknown feature' };
      })
    : [];
  
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
        {features.length > 0 && (
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
                    {features.map((feature, index) => {
                      const isEven = index % 2 === 0;
                      
                      return (
                        <TableRow 
                          key={feature.id || index}
                          style={{ 
                            backgroundColor: isEven ? '#e2e8f0' : '#f3f3f3',
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
