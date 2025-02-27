
import { CalendarDays, Ruler, Home, Bed, Bath, Car, Zap, Info } from "lucide-react";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyDetailsProps {
  property: PropertyData;
  primaryColor?: string;
  settings?: AgencySettings;
}

export function PropertyDetails({ property, primaryColor, settings }: PropertyDetailsProps) {
  const [energyImage, setEnergyImage] = useState<string | null>(null);
  
  // Fetch energy label image on component mount
  useEffect(() => {
    const fetchEnergyImage = async () => {
      if (property.energyLabel) {
        const energyClass = property.energyLabel.toUpperCase().charAt(0);
        
        try {
          const { data } = await supabase.storage
            .from('global')
            .getPublicUrl(`energy/${energyClass}.png`);
          
          if (data) {
            setEnergyImage(data.publicUrl);
          }
        } catch (error) {
          console.error('Error in energy image fetch operation:', error);
        }
      }
    };
    
    fetchEnergyImage();
  }, [property.energyLabel]);

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
            className="p-4 rounded-lg flex"
            style={{ backgroundColor: settings?.primaryColor }}
          >
            {/* Icon container - now spans the full height */}
            <div className="flex items-center mr-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: settings?.secondaryColor }}
              >
                <detail.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Text content container */}
            <div className="flex flex-col justify-center">
              <p className="text-white font-bold text-xs mb-1">{detail.label}</p>
              <p className="text-white font-bold text-sm">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right side: Energy label column - showing only the image, no label */}
      <div className="row-span-2 rounded-lg flex flex-col items-center justify-center p-4">
        {/* Energy label image from Supabase */}
        {energyImage ? (
          <div className="flex items-center justify-center -mt-4">
            {/* White background circle for the energy image, made much larger, with shadow */}
            <div className="w-48 h-48 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-lg">
              <img 
                src={energyImage} 
                alt={`Energy Class ${currentGrade}`} 
                className="w-40 h-40 object-contain opacity-80" 
              />
            </div>
          </div>
        ) : currentGrade ? (
          // Fallback to the previous visualization if image isn't loaded
          <div className="relative w-full max-w-[180px] h-[200px]">
            {/* Energy class bars */}
            <div className="absolute bottom-0 w-full h-[150px]">
              <div className="relative w-full h-full flex">
                {allGrades.map((grade, index) => {
                  const isCurrentGrade = grade === currentGrade;
                  // Calculate height percentage - A is shortest (most efficient), G is tallest (least efficient)
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
        ) : (
          <div className="text-gray-700 text-sm mt-4">
            Energy class not specified
          </div>
        )}
      </div>
    </div>
  );
}
