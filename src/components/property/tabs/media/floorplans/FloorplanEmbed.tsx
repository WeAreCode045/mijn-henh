
import { ChangeEvent } from 'react';

export interface FloorplanEmbedProps {
  script: string;  // Changed from embedScript to script to match usage
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void; 
}

export function FloorplanEmbed({ script, onChange }: FloorplanEmbedProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">
        Floorplan Embed Script
      </label>
      <textarea
        value={script}
        onChange={onChange}
        rows={6}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste 3D floorplan embed script here..."
      />
      
      {script && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Preview:</h3>
          <div className="p-4 border rounded-md bg-gray-50 min-h-[300px]">
            <div dangerouslySetInnerHTML={{ __html: script }} />
          </div>
        </div>
      )}
    </div>
  );
}
