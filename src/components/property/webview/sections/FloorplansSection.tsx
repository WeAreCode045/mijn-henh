
import { WebViewSectionProps } from "../types";
import { useState } from "react";
import { ImagePreviewDialog } from "../components/ImagePreviewDialog";
import { PropertyFloorplan } from "@/types/property";

export function FloorplansSection({ property, settings }: WebViewSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const getFloorplansByColumns = () => {
    const floorplans = property.floorplans || [];
    const technicalItems = property.technicalItems || [];
    
    // Check if using the legacy format (array of strings)
    const isLegacyFormat = floorplans.length > 0 && typeof floorplans[0] === 'string';
    
    if (isLegacyFormat) {
      return [{
        columns: 1,
        plans: (floorplans as unknown as string[]).map((url: string) => ({ url, columns: 1 }))
      }];
    }
    
    // Using the new format (array of objects with url and columns)
    const resultGroups: { [key: number]: PropertyFloorplan[] } = {};
    
    technicalItems.forEach(item => {
      if (item.floorplanId !== null && item.floorplanId !== '') {
        const floorplan = floorplans.find(fp => fp.id === item.floorplanId);
        
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
    
    // For any floorplans not linked to a technical item, put them in the 1-column group
    floorplans.forEach((plan) => {
      // Check if this floorplan is already assigned to a technical item
      const isAssigned = technicalItems.some(item => 
        item.floorplanId !== null && item.floorplanId === plan.id
      );
      
      if (!isAssigned) {
        if (!resultGroups[1]) {
          resultGroups[1] = [];
        }
        resultGroups[1].push({
          ...plan,
          columns: 1
        });
      }
    });
    
    return Object.entries(resultGroups).map(([columns, plans]) => ({
      columns: parseInt(columns),
      plans
    }));
  };

  const floorplanGroups = getFloorplansByColumns();

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
                  key={plan.id || index} 
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
