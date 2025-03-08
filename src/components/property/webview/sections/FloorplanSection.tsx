
import { WebViewSectionProps } from "../types";
import "../styles/WebViewStyles.css";

export function FloorplanSection({ property }: WebViewSectionProps) {
  // Log the floorplan embed script for debugging
  console.log('FloorplanSection rendered, embed script exists:', !!property.floorplanEmbedScript);
  
  if (!property.floorplanEmbedScript) {
    console.warn('No floorplan embed script available for property:', property.id);
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No floorplan available for this property</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-estate-800">Floorplan</h2>
      <div className="w-full overflow-hidden rounded-lg shadow-md">
        <div 
          className="w-full min-h-[500px]"
          dangerouslySetInnerHTML={{ __html: property.floorplanEmbedScript }} 
        />
      </div>
    </div>
  );
}
