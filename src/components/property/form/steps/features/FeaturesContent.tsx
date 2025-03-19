
import React from "react";
import { PropertyFeature } from "@/types/property";

interface FeaturesContentProps {
  features: PropertyFeature[];
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
}

export function FeaturesContent({
  features,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature
}: FeaturesContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Property Features</h3>
        <button
          type="button"
          onClick={onAddFeature}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Feature
        </button>
      </div>
      
      {features.length === 0 ? (
        <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
          No features added yet. Click the "Add Feature" button to add your first feature.
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2 p-3 border rounded-md">
              <input
                type="text"
                value={feature.description}
                onChange={(e) => onUpdateFeature(feature.id, e.target.value)}
                className="flex-1 px-3 py-1 border rounded"
                placeholder="Feature description"
              />
              <button
                type="button"
                onClick={() => onRemoveFeature(feature.id)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove feature"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-sm text-gray-600">
        <p>Add important features of your property that would appeal to potential buyers or renters.</p>
      </div>
    </div>
  );
}
