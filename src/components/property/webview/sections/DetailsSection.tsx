
import { PropertyDetails } from "../PropertyDetails";
import { WebViewSectionProps } from "../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function DetailsSection({ property, settings }: WebViewSectionProps) {
  console.log('Property details:', property);

  // Function to get lighter tint of a color
  const getLighterTint = (hexColor: string, percent: number = 0.8): string => {
    // Remove the # if present
    let hex = hexColor.replace('#', '');
    
    // Parse the hex color to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten by mixing with white (255, 255, 255)
    r = Math.floor(r + (255 - r) * percent);
    g = Math.floor(g + (255 - g) * percent);
    b = Math.floor(b + (255 - b) * percent);
    
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
                    
                    // Get light tint of primary color for even rows
                    // and very light (almost white) tint of secondary color for odd rows
                    const bgColor = isEven 
                      ? getLighterTint(settings?.primaryColor || '#0EA5E9', 0.7)
                      : getLighterTint(settings?.secondaryColor || '#7E69AB', 0.95);
                    
                    return (
                      <TableRow 
                        key={feature.id || index}
                        style={{ 
                          backgroundColor: bgColor,
                          borderBottom: 'none'
                        }}
                      >
                        <TableCell className={`p-2 ${isEven ? 'text-gray-800' : 'text-gray-800'}`}>
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
