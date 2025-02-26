
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

  return (
    <div className="space-y-4 pb-24 relative">
      <div className="bg-white/90 p-4 rounded-lg shadow-sm mx-6 relative">
        <h3 className="text-xl font-semibold mb-4">Floorplans</h3>
        <div className="space-y-4">
          {property.floorplans?.map((plan, index) => (
            <div key={index} className="w-full cursor-pointer" onClick={() => handleImageClick(plan)}>
              <img
                src={plan}
                alt={`Floorplan ${index + 1}`}
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image preview dialog */}
      <ImagePreviewDialog selectedImage={selectedImage} onClose={handleClosePreview} />
    </div>
  );
}
