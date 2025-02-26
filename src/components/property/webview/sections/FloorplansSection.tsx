
import { WebViewSectionProps } from "../types";

export function FloorplansSection({ property }: WebViewSectionProps) {
  return (
    <div className="space-y-4 pb-24">
      <h3 className="text-xl font-semibold mb-4">Floorplans</h3>
      <div className="space-y-4">
        {property.floorplans?.map((plan, index) => (
          <div key={index} className="w-full">
            <img
              src={plan}
              alt={`Floorplan ${index + 1}`}
              className="w-full h-auto object-contain max-h-[400px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
