
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyValidation } from "./usePropertyValidation";
import { useNavigate } from "react-router-dom";
import { usePropertyImageSaver } from "./usePropertyImageSaver";
import { usePropertyDataPreparer } from "./usePropertyDataPreparer";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { prepareAreasForFormSubmission, preparePropertiesForJsonField } from "./preparePropertyData";

export function usePropertyFormSubmitHandler() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validatePropertyData } = usePropertyValidation();
  const { savePropertyImages } = usePropertyImageSaver();
  const { prepareSubmitData } = usePropertyDataPreparer();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData, shouldRedirect = false) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log("usePropertyFormSubmit - handleSubmit called with formData:", formData);
    
    // If this is a new property, validate the data first
    if (!formData.id) {
      if (!validatePropertyData(formData)) {
        return false;
      }
    }
    
    try {
      // Prepare data for submission
      const submitData = prepareSubmitData(formData);
      console.log("usePropertyFormSubmit - Final submit data:", submitData);
      
      let success = false;
      
      if (formData.id) {
        // Update existing property
        console.log("Updating existing property with ID:", formData.id);
        
        // Convert the areas to the correct format for database
        const areasForDb = prepareAreasForFormSubmission(submitData.areas || []);
        
        // Transform features, nearby_places, and nearby_cities to JSON strings
        const featuresJson = typeof submitData.features === 'string' 
          ? submitData.features 
          : JSON.stringify(submitData.features || []);
        
        const nearby_placesJson = typeof submitData.nearby_places === 'string'
          ? submitData.nearby_places
          : JSON.stringify(submitData.nearby_places || []);
        
        const nearby_citiesJson = typeof submitData.nearby_cities === 'string'
          ? submitData.nearby_cities
          : JSON.stringify(submitData.nearby_cities || []);
        
        // Create a database-ready object
        const dbData = {
          title: submitData.title,
          price: submitData.price,
          address: submitData.address,
          bedrooms: submitData.bedrooms,
          bathrooms: submitData.bathrooms,
          sqft: submitData.sqft,
          livingArea: submitData.livingArea,
          buildYear: submitData.buildYear,
          garages: submitData.garages,
          energyLabel: submitData.energyLabel,
          hasGarden: submitData.hasGarden,
          shortDescription: submitData.shortDescription || "",
          description: submitData.description,
          location_description: submitData.location_description,
          features: featuresJson,
          areas: areasForDb as Json[],
          nearby_places: nearby_placesJson,
          nearby_cities: nearby_citiesJson,
          latitude: submitData.latitude,
          longitude: submitData.longitude,
          map_image: submitData.map_image,
          object_id: submitData.object_id,
          agent_id: submitData.agent_id,
          template_id: submitData.template_id,
          virtualTourUrl: submitData.virtualTourUrl,
          youtubeUrl: submitData.youtubeUrl,
          floorplanEmbedScript: submitData.floorplanEmbedScript || ""
        };
        
        console.log("Database update data:", dbData);
        
        // Make a direct database update to ensure data is saved
        const { error } = await supabase
          .from('properties')
          .update(dbData)
          .eq('id', formData.id);
          
        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
        
        console.log("Property updated successfully in database");
        success = true;
        
        if (success) {
          console.log("Now saving images");
          // Save or update featured images
          await savePropertyImages(formData);
          console.log("Images saved successfully");
        }
      } else {
        // Create new property
        console.log("Creating new property");
        
        // Convert the areas to the correct format for database
        const areasForDb = prepareAreasForFormSubmission(submitData.areas || []);
        
        // Transform features, nearby_places, and nearby_cities to JSON strings
        const featuresJson = typeof submitData.features === 'string' 
          ? submitData.features 
          : JSON.stringify(submitData.features || []);
        
        const nearby_placesJson = typeof submitData.nearby_places === 'string'
          ? submitData.nearby_places
          : JSON.stringify(submitData.nearby_places || []);
        
        const nearby_citiesJson = typeof submitData.nearby_cities === 'string'
          ? submitData.nearby_cities
          : JSON.stringify(submitData.nearby_cities || []);
        
        // Create a database-ready object
        const dbData = {
          title: submitData.title,
          price: submitData.price,
          address: submitData.address,
          bedrooms: submitData.bedrooms,
          bathrooms: submitData.bathrooms,
          sqft: submitData.sqft,
          livingArea: submitData.livingArea,
          buildYear: submitData.buildYear,
          garages: submitData.garages,
          energyLabel: submitData.energyLabel,
          hasGarden: submitData.hasGarden,
          shortDescription: submitData.shortDescription || "",
          description: submitData.description,
          location_description: submitData.location_description,
          features: featuresJson,
          areas: areasForDb as Json[],
          nearby_places: nearby_placesJson,
          nearby_cities: nearby_citiesJson,
          latitude: submitData.latitude,
          longitude: submitData.longitude,
          map_image: submitData.map_image,
          object_id: submitData.object_id,
          agent_id: submitData.agent_id,
          template_id: submitData.template_id,
          virtualTourUrl: submitData.virtualTourUrl,
          youtubeUrl: submitData.youtubeUrl,
          floorplanEmbedScript: submitData.floorplanEmbedScript || ""
        };
        
        console.log("Database insert data:", dbData);
        
        // Make a direct database insert
        const { error } = await supabase
          .from('properties')
          .insert(dbData);
          
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        
        console.log("Property created successfully in database");
        success = true;
        
        if (success) {
          console.log("Getting new property ID");
          const newPropertyId = await getNewPropertyId(formData.title);
          
          if (newPropertyId) {
            console.log("New property ID obtained:", newPropertyId);
            // Save images for new property
            await saveAllImagesForNewProperty(newPropertyId, formData);
          } else {
            console.log("Could not obtain new property ID");
          }
        }
        
        if (success && shouldRedirect) {
          navigate('/');
        }
      }
      
      console.log("usePropertyFormSubmit - Submission result:", success ? "Success" : "Failed");
      
      // Show a toast notification to confirm the save was successful
      if (success) {
        toast({
          title: "Success",
          description: formData.id ? "Property updated successfully" : "Property created successfully",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error during property submit:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your request",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleSubmit };
}

// Helper function to get the ID of a newly created property
async function getNewPropertyId(title: string): Promise<string | null> {
  try {
    const { data: newProperty, error } = await supabase
      .from('properties')
      .select('id')
      .eq('title', title)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error("Error getting new property ID:", error);
      return null;
    }
      
    return newProperty?.id || null;
  } catch (error) {
    console.error("Exception getting new property ID:", error);
    return null;
  }
}

async function saveAllImagesForNewProperty(propertyId: string, formData: PropertyFormData) {
  try {
    // Add regular images to property_images table
    for (const image of formData.images || []) {
      const imageUrl = typeof image === 'string' ? image : image.url;
      await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: imageUrl,
          is_main: formData.featuredImage === imageUrl,
          is_featured_image: formData.featuredImages?.includes(imageUrl) || false,
          type: 'image'
        });
    }
    
    // Add floorplans to property_images table
    if (formData.floorplans && formData.floorplans.length > 0) {
      for (const floorplan of formData.floorplans) {
        const floorplanUrl = typeof floorplan === 'string' ? floorplan : floorplan.url;
        if (!floorplanUrl) continue;
        
        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            url: floorplanUrl,
            type: 'floorplan'
          });
      }
    }
  } catch (error) {
    console.error("Error adding images to property_images table:", error);
    // Don't consider this a failure of the overall save
  }
}
