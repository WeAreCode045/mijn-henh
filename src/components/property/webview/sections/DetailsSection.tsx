
import { PropertyDetails } from "../PropertyDetails";
import { WebViewSectionProps } from "../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";

export function DetailsSection({ property, settings }: WebViewSectionProps) {
  // Ensure features is always an array
  const features = property.features ? (
    Array.isArray(property.features) ? property.features : [property.features]
  ) : [];
  
  console.log("Properties features:", features);
  
  return (
    <div className="space-y-6 pb-16">
      <div className="px-6">
        <PropertyDetails 
          property={property}
          settings={settings}
        />
      </div>
      
      <div className="px-6 py-1 flex flex-col md:flex-row gap-6">
        {/* Description Section - adjusted width to be more balanced */}
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

        {/* Features Section - adjusted width to be more balanced */}
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
                              {feature.description || feature.name}
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
