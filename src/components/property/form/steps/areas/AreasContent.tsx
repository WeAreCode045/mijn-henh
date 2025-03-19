
import React from "react";
import { PropertyArea, PropertyImage } from "@/types/property";

interface AreasContentProps {
  areas: PropertyArea[];
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  images: PropertyImage[];
  isUploading?: boolean;
}

export function AreasContent({
  areas,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  images,
  isUploading = false
}: AreasContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Property Areas</h3>
        <button
          type="button"
          onClick={onAddArea}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Area
        </button>
      </div>
      
      {areas.length === 0 ? (
        <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
          No areas added yet. Click the "Add Area" button to add your first area.
        </div>
      ) : (
        <div className="space-y-6">
          {areas.map((area) => (
            <div key={area.id} className="p-4 border rounded-md space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Area Details</h4>
                <button
                  type="button"
                  onClick={() => onRemoveArea(area.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                  aria-label="Remove area"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor={`area-name-${area.id}`} className="block text-sm font-medium">Name</label>
                  <input
                    id={`area-name-${area.id}`}
                    type="text"
                    value={area.name || ''}
                    onChange={(e) => onUpdateArea(area.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`area-size-${area.id}`} className="block text-sm font-medium">Size</label>
                  <input
                    id={`area-size-${area.id}`}
                    type="text"
                    value={area.size || ''}
                    onChange={(e) => onUpdateArea(area.id, 'size', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor={`area-description-${area.id}`} className="block text-sm font-medium">Description</label>
                <textarea
                  id={`area-description-${area.id}`}
                  value={area.description || ''}
                  onChange={(e) => onUpdateArea(area.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Area Images</label>
                
                {/* Image Upload Button */}
                <div className="flex items-center space-x-2">
                  <label htmlFor={`area-images-${area.id}`} className="cursor-pointer px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                    {isUploading ? 'Uploading...' : 'Upload Images'}
                    <input
                      id={`area-images-${area.id}`}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          onAreaImageUpload(area.id, e.target.files);
                          e.target.value = '';  // Reset the input
                        }
                      }}
                      disabled={isUploading}
                    />
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => {
                      // Show image selection modal/dialog
                      // This is a placeholder; you'd need to implement the actual image selection UI
                      alert("Image selection functionality would go here");
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Select Images
                  </button>
                </div>
                
                {/* Image Grid */}
                {area.images && area.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {area.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`Area ${area.name} image`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => onAreaImageRemove(area.id, image.id)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
                    No images added yet. Upload or select images for this area.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
