
import { PropertyDetails } from "../PropertyDetails";
import { WebViewSectionProps } from "../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function DetailsSection({ property, settings }: WebViewSectionProps) {
  console.log('Property details:', property);

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
          {settings?.descriptionBackgroundUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${settings.descriptionBackgroundUrl})`,
                opacity: 0.2
              }}
            />
          )}
          <div className="relative">
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
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: settings?.secondaryColor }}
            >
              Features
            </h3>
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableBody>
                  {property.features.map((feature, index) => {
                    const isEven = index % 2 === 0;
                    // Use white for odd rows instead of the lighter shade
                    const bgColor = isEven 
                      ? settings?.secondaryColor || '#7E69AB'
                      : '#FFFFFF';
                    
                    return (
                      <TableRow 
                        key={feature.id || index}
                        style={{ 
                          backgroundColor: bgColor,
                          borderBottom: 'none'
                        }}
                      >
                        <TableCell className={`p-2 ${isEven ? 'text-white' : 'text-gray-800'}`}>
                          {feature.description}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
