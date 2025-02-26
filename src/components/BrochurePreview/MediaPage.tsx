
import { Card } from "@/components/ui/card";

interface MediaPageProps {
  images: string[];
  floorplans: string[];
}

export function MediaPage({ images, floorplans }: MediaPageProps) {
  return (
    <Card className="w-full bg-white shadow-lg animate-fadeIn mb-8 p-6">
      {images.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-estate-700">Foto's</h3>
          <div className="grid grid-cols-2 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative pb-[75%] overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Foto ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {floorplans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-estate-700">Plattegronden</h3>
          <div className="grid grid-cols-2 gap-4">
            {floorplans.map((floorplanUrl, index) => (
              <div key={index} className="relative pb-[75%] overflow-hidden">
                <img
                  src={floorplanUrl}
                  alt={`Plattegrond ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
