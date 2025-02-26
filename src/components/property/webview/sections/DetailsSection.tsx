
import { PropertyDetails } from "../PropertyDetails";
import { WebViewSectionProps } from "../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";

export function DetailsSection({ property, settings }: WebViewSectionProps) {
  return (
    <div className="space-y-4 pb-24">
      <PropertyDetails 
        property={property}
        primaryColor={settings?.secondaryColor}
        settings={settings}
      />
      
      <div className="px-6 py-2 flex flex-col md:flex-row gap-6">
        {/* Description Section */}
        <div className="flex-1 relative">
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
        {property.features && property.features.length > 0 && (
          <div className="flex-1">
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
                    {property.features.map((feature, index) => {
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
                            <Check 
                              className="w-5 h-5 mr-2"
                              strokeWidth={2.5}
                              style={{ color: settings?.secondaryColor }}
                            />
                            <span style={{ fontWeight: 600 }}>
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
