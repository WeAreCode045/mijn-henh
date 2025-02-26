
import { CalendarDays, Ruler, Home, Bed, Bath, Car, Zap, Info } from "lucide-react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyDetailsProps {
  property: PropertyData;
  primaryColor?: string;
  settings?: AgencySettings;
}

export function PropertyDetails({ property, primaryColor, settings }: PropertyDetailsProps) {
  const detailsConfig = [
    { icon: CalendarDays, label: "Build Year", value: property.buildYear },
    { icon: Home, label: "Living Area", value: `${property.livingArea} m²` },
    { icon: Ruler, label: "Plot Size", value: `${property.sqft} m²` },
    { icon: Bed, label: "Bedrooms", value: property.bedrooms },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms },
    { icon: Car, label: "Garages", value: property.garages }
  ];

  // Energy label colors based on standard EU energy labels
  const energyLabelColors: Record<string, string> = {
    'A': '#00A651', // Green
    'B': '#50B848',
    'C': '#B6C727',
    'D': '#FFF200', // Yellow
    'E': '#FFB81C',
    'F': '#F15A29',
    'G': '#ED1C24'  // Red
  };
  
  // Default to a neutral color if no valid energy label
  const energyLabelColor = 
    property.energyLabel && energyLabelColors[property.energyLabel.toUpperCase().charAt(0)] 
      ? energyLabelColors[property.energyLabel.toUpperCase().charAt(0)]
      : '#94A3B8'; // Gray

  // Energy label grades for the barometer
  const energyGrades = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const currentGrade = property.energyLabel?.toUpperCase().charAt(0) || null;

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {/* Left side: 2x3 grid of property details */}
      <div className="col-span-3 grid grid-cols-3 grid-rows-2 gap-4">
        {detailsConfig.map((detail, index) => (
          <div
            key={index}
            className="p-4 rounded-lg"
            style={{ backgroundColor: settings?.primaryColor }}
          >
            <div className="flex items-center space-x-3 mb-1">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: settings?.secondaryColor }}
              >
                <detail.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-bold text-xs">{detail.label}</p>
            </div>
            <p className="text-white font-bold text-sm ml-11">{detail.value}</p>
          </div>
        ))}
      </div>

      {/* Right side: Energy label column spanning two rows */}
      <div 
        className="row-span-2 rounded-lg flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: settings?.primaryColor }}
      >
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: settings?.secondaryColor }}
        >
          <Zap className="w-6 h-6 text-white" />
        </div>
        <p className="text-white font-bold text-sm mb-4">Energy Label</p>
        
        {/* Energy efficiency barometer */}
        <div className="w-full max-w-[120px] mb-3">
          {energyGrades.map((grade) => {
            const isCurrentGrade = grade === currentGrade;
            const barColor = energyLabelColors[grade];
            
            return (
              <div key={grade} className="flex items-center mb-1">
                <div className="w-8 text-white text-xs font-bold text-center mr-2">
                  {grade}
                </div>
                <div 
                  className={`h-5 flex-grow rounded-sm relative ${isCurrentGrade ? 'border-2 border-white' : ''}`}
                  style={{ backgroundColor: barColor }}
                >
                  {isCurrentGrade && (
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rotate-45 transform"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current energy grade display */}
        {currentGrade ? (
          <div className="flex flex-col items-center mt-2">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-1"
              style={{ backgroundColor: energyLabelColor }}
            >
              {currentGrade}
            </div>
            <p 
              className="text-sm font-semibold"
              style={{ color: energyLabelColor }}
            >
              {property.energyLabel || 'Not specified'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-2">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-1"
              style={{ backgroundColor: '#94A3B8' }}
            >
              ?
            </div>
            <p className="text-white text-sm">
              Not specified
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
