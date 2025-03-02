
import { WebViewSectionProps } from "../types";
import { useState, useEffect } from "react";
import { ImagePreviewDialog } from "../components/ImagePreviewDialog";
import { PropertyFloorplan } from "@/types/property";

export function FloorplansSection({ property, settings }: WebViewSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [parsedFloorplans, setParsedFloorplans] = useState<PropertyFloorplan[]>([]);

  useEffect(() => {
    // Parse floorplans when the component mounts or when property.floorplans changes
    if (property.floorplans && Array.isArray(property.floorplans)) {
      try {
        const parsed = property.floorplans.map(floorplan => {
          if (typeof floorplan === 'string') {
            try {
              // Try to parse as JSON string
              return JSON.parse(floorplan);
            } catch (e) {
              // If parsing fails, it's a plain URL string
              return { id: crypto.randomUUID(), url: floorplan, columns: 1 };
            }
          }
          // Already an object
          return floorplan;
        });
        console.log("FloorplansSection - Parsed floorplans:", parsed);
        setParsedFloorplans(parsed);
      } catch (error) {
        console.error("Error parsing floorplans:", error);
      }
    }
  }, [property.floorplans]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const getFloorplansByColumns = () => {
    if (!parsedFloorplans.length) {
      return [];
    }
    
    // Group floorplans by column count
    const resultGroups: { [key: number]: PropertyFloorplan[] } = {};
    
    // First, check for technical items with floorplanId references
    if (property.technicalItems && Array.isArray(property.technicalItems)) {
      property.technicalItems.forEach(item => {
        if (item.floorplanId) {
          const floorplan = parsedFloorplans.find(fp => fp.id === item.floorplanId);
          
          if (floorplan) {
            const columns = item.columns || 1;
            if (!resultGroups[columns]) {
              resultGroups[columns] = [];
            }
            resultGroups[columns].push({
              ...floorplan,
              columns
            });
          }
        }
      });
    }
    
    // For floorplans not linked to technical items, group by their own column value
    parsedFloorplans.forEach(plan => {
      // Check if this floorplan is already assigned to a technical item
      const isAssigned = property.technicalItems && Array.isArray(property.technicalItems) && 
        property.technicalItems.some(item => 
          item.floorplanId === plan.id
        );
      
      if (!isAssigned) {
        const columns = plan.columns || 1;
        if (!resultGroups[columns]) {
          resultGroups[columns] = [];
        }
        resultGroups[columns].push(plan);
      }
    });
    
    return Object.entries(resultGroups).map(([columns, plans]) => ({
      columns: parseInt(columns),
      plans
    }));
  };

  const floorplanGroups = getFloorplansByColumns();

  if (!parsedFloorplans.length && !property.floorplanEmbedScript) {
    return null;
  }

  return (
    <div className="space-y-6 pb-24 relative">
      <div className="bg-white/90 p-4 rounded-lg shadow-sm mx-6 relative">
        <h3 className="text-xl font-semibold mb-4">Floorplans</h3>
        
        {property.floorplanEmbedScript && (
          <div className="mb-6 w-full">
            <div 
              className="w-full h-[400px] rounded-lg overflow-hidden" 
              dangerouslySetInnerHTML={{ __html: property.floorplanEmbedScript }}
            />
          </div>
        )}
        
        {floorplanGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className={`grid grid-cols-${group.columns} gap-4`}>
              {group.plans.map((plan, index) => (
                <div 
                  key={plan.id || `floorplan-${groupIndex}-${index}`} 
                  className="w-full cursor-pointer shadow-md rounded-lg overflow-hidden" 
                  onClick={() => handleImageClick(plan.url)}
                >
                  <img
                    src={plan.url}
                    alt={`Floorplan ${groupIndex + 1}-${index + 1}`}
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Image preview dialog */}
      <ImagePreviewDialog selectedImage={selectedImage} onClose={handleClosePreview} />
    </div>
  );
}
