
import { PropertyData } from "@/types/property";

export const transformSupabaseData = (data: any): PropertyData => {
  return {
    ...data,
    features: Array.isArray(data.features) 
      ? data.features.map((f: any) => ({
          id: f.id || String(Date.now()),
          description: f.description || ""
        }))
      : [],
    areas: Array.isArray(data.areas)
      ? data.areas.map((a: any) => ({
          id: a.id || String(Date.now()),
          title: a.title || "",
          description: a.description || "",
          images: a.images || []
        }))
      : []
  };
};
