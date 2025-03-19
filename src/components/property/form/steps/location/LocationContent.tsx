
import React from "react";
import { PropertyFormData } from "@/types/property";

interface LocationContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
}

export function LocationContent({
  formData,
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap
}: LocationContentProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Location</h3>
      
      {/* Address Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium">Address</label>
          <input
            id="address"
            type="text"
            value={formData.address || ''}
            onChange={(e) => onFieldChange('address', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onFetchLocationData}
            disabled={isLoadingLocationData}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoadingLocationData ? 'Loading...' : 'Fetch Location Data'}
          </button>
        </div>
      </div>
      
      {/* Map Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="latitude" className="block text-sm font-medium">Latitude</label>
          <input
            id="latitude"
            type="text"
            value={formData.latitude?.toString() || ''}
            onChange={(e) => onFieldChange('latitude', parseFloat(e.target.value) || null)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="longitude" className="block text-sm font-medium">Longitude</label>
          <input
            id="longitude"
            type="text"
            value={formData.longitude?.toString() || ''}
            onChange={(e) => onFieldChange('longitude', parseFloat(e.target.value) || null)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      
      {/* Location Description */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="location_description" className="block text-sm font-medium">Location Description</label>
          {onGenerateLocationDescription && (
            <button
              type="button"
              onClick={onGenerateLocationDescription}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Generate Description
            </button>
          )}
        </div>
        <textarea
          id="location_description"
          value={formData.location_description || ''}
          onChange={(e) => onFieldChange('location_description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      {/* Map Image */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Map Image</label>
          {onGenerateMap && (
            <button
              type="button"
              onClick={onGenerateMap}
              disabled={isGeneratingMap}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isGeneratingMap ? 'Generating...' : 'Generate Map'}
            </button>
          )}
        </div>
        
        {formData.map_image && (
          <div className="relative">
            <img
              src={formData.map_image}
              alt="Property Map"
              className="max-w-full h-auto border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
