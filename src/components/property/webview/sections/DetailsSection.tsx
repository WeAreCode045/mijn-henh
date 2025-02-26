
import { PropertyDetails } from "../PropertyDetails";
import { WebViewSectionProps } from "../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function DetailsSection({ property, settings }: WebViewSectionProps) {
  console.log('Property details:', property);

  // Function to get lighter shade of a color
  const getLighterShade = (hexColor: string): string => {
    // Remove the # if present
    let hex = hexColor.replace('#', '');
    
    // Parse the hex color to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten by mixing with white (255, 255, 255)
    r = Math.floor(r + (255 - r) * 0.7);
    g = Math.floor(g + (255 - g) * 0.7);
    b = Math.floor(b + (255 - b) * 0.7);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

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
                    const bgColor = isEven 
                      ? settings?.secondaryColor || '#7E69AB'
                      : getLighterShade(settings?.secondaryColor || '#7E69AB');
                    
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
