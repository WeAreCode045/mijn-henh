
import { WebViewSectionProps } from "../types";
import { WebViewImageGrid } from "../WebViewImageGrid";

export function OverviewSection({ property, settings }: WebViewSectionProps) {
  return (
    <div className="space-y-4 pb-24">

      <div className="space-y-4 mt-2">
        {property.featuredImage && (
          <>
            <div className="relative px-6">
              <img
                src={property.featuredImage}
                alt={property.title}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>

            <WebViewImageGrid images={property.gridImages} settings={settings} isLocationGrid={false} />
          </>
        )}
      </div>
    </div>
  );
}
