
import { useState, useEffect } from "react";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { initialFormData } from "./initialFormData";
import { fetchPropertyData } from "./services/propertyFetchService";
import { mapPropertyDataToFormData } from "./utils/mapPropertyData";

export function usePropertyFetch(id: string | undefined) {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    async function loadProperty() {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        const { propertyData, processedImages } = await fetchPropertyData(id);
        
        console.log("Raw property data:", propertyData);
        console.log("Property data retrieved:", {
          title: propertyData.title,
          imagesCount: processedImages.length,
          floorplansCount: processedImages.filter(img => img.type === 'floorplan').length
        });
        
        // Map the data to our form structure
        const updatedFormData = mapPropertyDataToFormData(propertyData, processedImages);
        
        console.log("Processed form data:", {
          title: updatedFormData.title,
          price: updatedFormData.price,
          address: updatedFormData.address,
          imagesCount: updatedFormData.images.length,
          features: updatedFormData.features.length,
          areas: updatedFormData.areas.length
        });
        
        setFormData(updatedFormData);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProperty();
  }, [id]);
  
  return { formData, setFormData, isLoading };
}
