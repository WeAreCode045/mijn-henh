
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

  // Get current grade
  const currentGrade = property.energyLabel?.toUpperCase().charAt(0) || null;
  
  // Generate 5 energy grades with the current grade in the middle (3rd position)
  let displayGrades: string[] = [];
  
  if (currentGrade) {
    const allGrades = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const currentIndex = allGrades.indexOf(currentGrade);
    
    if (currentIndex !== -1) {
      // Calculate the starting index to place current grade in the middle (3rd position)
      let startIndex = currentIndex - 2;
      
      // Ensure we don't go below 0
      if (startIndex < 0) startIndex = 0;
      
      // Ensure we don't go beyond the end of available grades
      if (startIndex + 5 > allGrades.length) {
        startIndex = allGrades.length - 5;
      }
      
      // If we don't have enough grades, just show what we have
      if (startIndex < 0) startIndex = 0;
      
      // Get 5 grades (or fewer if not enough)
      displayGrades = allGrades.slice(startIndex, startIndex + 5);
    }
  } else {
    // If no grade, show the first 5 grades
    displayGrades = ['A', 'B', 'C', 'D', 'E'];
  }

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

      {/* Right side: Energy label column spanning two rows - without background */}
      <div className="row-span-2 rounded-lg flex flex-col items-center justify-center p-4">
        <p className="text-gray-700 font-bold text-sm mb-4">Energy Label</p>
        
        {/* Energy efficiency barometer - maximum 5 gradations */}
        <div className="w-full max-w-[120px] mb-3">
          {displayGrades.map((grade) => {
            const isCurrentGrade = grade === currentGrade;
            const barColor = energyLabelColors[grade];
            
            return (
              <div key={grade} className="flex items-center mb-1">
                <div className="w-8 text-gray-700 text-xs font-bold text-center mr-2">
                  {grade}
                </div>
                <div 
                  className={`h-5 flex-grow rounded-sm relative ${isCurrentGrade ? 'border-2 border-gray-700' : ''}`}
                  style={{ backgroundColor: barColor }}
                >
                  {isCurrentGrade && (
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-gray-700 rotate-45 transform"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Display unknown energy label if not specified */}
        {!currentGrade && (
          <div className="text-gray-700 text-sm mt-2">
            Not specified
          </div>
        )}
      </div>
    </div>
  );
}
