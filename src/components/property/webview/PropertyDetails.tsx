
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
  
  // Always show all energy grades A-G for the new visualization
  const allGrades = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

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

      {/* Right side: Energy label column spanning two rows - new house-style visualization */}
      <div className="row-span-2 rounded-lg flex flex-col items-center justify-center p-4">
        <p className="text-gray-700 font-bold text-sm mb-4">Energy Label</p>
        
        {/* Top energy rating banner showing the current rating */}
        {currentGrade && (
          <div className="relative w-full max-w-[180px] mb-2">
            <div className="w-full h-12 bg-gray-100 relative">
              {/* Banner shape with zigzags */}
              <div className="absolute bottom-0 w-full h-3 overflow-hidden">
                <div className="flex">
                  {allGrades.map((_, i) => (
                    <div key={i} className="w-1/7 h-3 bg-gray-100">
                      <div className="w-full h-full transform rotate-45 origin-bottom-right translate-y-1"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Current grade highlighted in dark blue/black banner */}
              <div className="absolute top-0 left-0 w-1/7 h-full flex items-center justify-center bg-gray-800 text-white font-bold text-2xl"
                   style={{
                     width: `${(100 / 7) * (currentGrade ? allGrades.indexOf(currentGrade) + 1 : 1)}%`,
                     clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)'
                   }}>
                {currentGrade}
              </div>
            </div>
          </div>
        )}
        
        {/* Main energy efficiency visualization with house */}
        <div className="relative w-full max-w-[180px] h-[200px]">
          {/* Energy class bars */}
          <div className="absolute bottom-0 w-full h-[150px]">
            <div className="relative w-full h-full flex">
              {allGrades.map((grade, index) => {
                const isCurrentGrade = grade === currentGrade;
                // Calculate height percentage - A is tallest, G is shortest in the reference image
                // But we want to make it the opposite - A is shortest (most efficient), G is tallest (least efficient)
                const heightPercentage = 60 + (index * 5);
                
                return (
                  <div 
                    key={grade} 
                    className={`relative flex-1 flex items-end justify-center 
                              ${isCurrentGrade ? 'ring-2 ring-gray-800 ring-inset z-10' : ''}`}
                    style={{ 
                      height: `${heightPercentage}%`,
                      backgroundColor: energyLabelColors[grade],
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%, 15% 85%)'
                    }}
                  >
                    <span className="absolute bottom-2 text-white font-bold text-sm">
                      {grade}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* House image */}
          <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 w-[120px] h-[80px] z-20">
            <img 
              src="/lovable-uploads/fa38e067-ac44-41ec-85d9-b34d88c88608.png" 
              alt="Energy Efficient House" 
              className="w-full h-full object-contain opacity-60"
            />
          </div>
        </div>
        
        {/* Display unknown energy label if not specified */}
        {!currentGrade && (
          <div className="text-gray-700 text-sm mt-4">
            Energy class not specified
          </div>
        )}
      </div>
    </div>
  );
}
