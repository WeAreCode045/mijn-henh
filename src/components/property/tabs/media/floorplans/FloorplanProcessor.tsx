
import { useEffect } from "react";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanProcessorProps {
  floorplans: PropertyFloorplan[] | string[];
  propertyId?: string;
  onProcessed: (processed: PropertyFloorplan[]) => void;
}

export function FloorplanProcessor({
  floorplans,
  propertyId,
  onProcessed
}: FloorplanProcessorProps) {
  useEffect(() => {
    console.log("FloorplanProcessor - floorplans prop updated:", floorplans);
    
    // Create a completely new array to avoid any recursive references
    const processed: PropertyFloorplan[] = [];
    
    if (Array.isArray(floorplans)) {
      // Use a traditional for loop to avoid any map/reduce issues with type recursion
      for (let i = 0; i < floorplans.length; i++) {
        const item = floorplans[i];
        
        if (typeof item === 'string') {
          try {
            // Try to parse string as JSON
            const parsed = JSON.parse(item);
            processed.push({
              id: parsed.id || `floorplan-${i}`,
              url: parsed.url || '',
              filePath: parsed.filePath || '',
              columns: typeof parsed.columns === 'number' ? parsed.columns : 1
            });
          } catch (e) {
            // If not valid JSON, treat as URL string
            processed.push({
              id: `floorplan-${i}`,
              url: item,
              columns: 1
            });
          }
        } else if (item && typeof item === 'object') {
          // For object types, create a new object with only the properties we need
          // This prevents TypeScript from trying to instantiate the full type recursively
          const floorplanObj = item as any;
          processed.push({
            id: floorplanObj.id || `floorplan-obj-${i}`,
            url: floorplanObj.url || '',
            filePath: floorplanObj.filePath || '',
            columns: typeof floorplanObj.columns === 'number' ? floorplanObj.columns : 1
          });
        }
      }
    }
      
    console.log("FloorplanProcessor - Processed floorplans:", processed);
    onProcessed(processed);
  }, [floorplans, onProcessed]);

  return null; // This is a logic-only component with no UI
}
