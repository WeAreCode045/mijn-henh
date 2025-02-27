
import { PropertyFormData, PropertyArea, PropertyFloorplan } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function prepareAreasForFormSubmission(areas: PropertyArea[]): Json[] {
  console.log("preparePropertyData - Preparing areas for submission:", areas);
  return areas.map(area => {
    console.log(`preparePropertyData - Processing area ${area.id} with columns:`, area.columns);
    return {
      id: area.id,
      title: area.title,
      description: area.description,
      imageIds: area.imageIds || [],
      columns: typeof area.columns === 'number' ? area.columns : 2
    };
  }) as unknown as Json[];
}

export function prepareFloorplansForFormSubmission(floorplans: PropertyFloorplan[]): string[] {
  console.log("preparePropertyData - Preparing floorplans for submission:", floorplans);
  return floorplans.map(floorplan => {
    console.log("preparePropertyData - Processing floorplan:", floorplan);
    return JSON.stringify({
      url: floorplan.url,
      columns: typeof floorplan.columns === 'number' ? floorplan.columns : 1
    });
  });
}

export function preparePropertiesForJsonField(data: PropertyFormData["features"] | PropertyFormData["nearby_places"]): Json {
  return data as unknown as Json;
}
