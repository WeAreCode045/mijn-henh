import { WebViewSectionProps } from "../types";
import { useState } from "react";
import { ImagePreviewDialog } from "../components/ImagePreviewDialog";

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
    
    const isLegacyFormat = floorplans.length > 0 && typeof floorplans[0] === 'string';
    
    if (isLegacyFormat) {
      return [{
        columns: 1,
        plans: floorplans.map((url: string) => ({ url, columns: 1 }))
      }];
    }
    
    const groupedFloorplans: { [key: number]: { url: string, columns: number }[] } = {};
    
    floorplans.forEach((plan: any) => {
      const columns = plan.columns || 1;
      if (!groupedFloorplans[columns]) {
        groupedFloorplans[columns] = [];
      }
      groupedFloorplans[columns].push(plan);
    });
    
    return Object.entries(groupedFloorplans).map(([columns, plans]) => ({
      columns: parseInt(columns),
      plans
    }));
  };

  const floorplanGroups = getFloorplansByColumns();

  return (
    <div className="space-y-6 pb-24 relative">
      <div className="bg-white/90 p-4 rounded-lg shadow-sm mx-6 relative">
        <h3 className="text-xl font-semibold mb-4">Floorplans</h3>
        
        {floorplanGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className={`grid grid-cols-${group.columns} gap-4`}>
              {group.plans.map((plan, index) => (
                <div 
                  key={index} 
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
