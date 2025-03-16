
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyValidation } from "./usePropertyValidation";
import { useNavigate } from "react-router-dom";
import { usePropertyImageSaver } from "./usePropertyImageSaver";
import { usePropertyDataPreparer } from "./usePropertyDataPreparer";
import { usePropertyDatabase } from "./usePropertyDatabase";

export function usePropertyFormSubmitHandler() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validatePropertyData } = usePropertyValidation();
  const { savePropertyImages, savePropertyFloorplans } = usePropertyImageSaver();
  const { prepareSubmitData } = usePropertyDataPreparer();
  const { updateProperty, createProperty } = usePropertyDatabase();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData, shouldRedirect = false) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log("usePropertyFormSubmit - handleSubmit called with formData:", formData);
    
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
        success = await updateProperty(formData.id, submitData);
        
        if (success) {
          console.log("Property updated successfully, now saving images");
          // Save or update featured images
          await savePropertyImages(formData);
        } else {
          console.log("Property update failed");
        }
      } else {
        // Create new property
        console.log("Creating new property");
        success = await createProperty(submitData);
        
        if (success) {
          console.log("Property created successfully, now getting new ID");
          const newPropertyId = await getNewPropertyId(formData.title);
          
          if (newPropertyId) {
            console.log("New property ID obtained:", newPropertyId);
            // Save images for new property
            await saveAllImagesForNewProperty(newPropertyId, formData);
          } else {
            console.log("Could not obtain new property ID");
          }
        } else {
          console.log("Property creation failed");
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
import { supabase } from "@/integrations/supabase/client";

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
    for (const image of formData.images) {
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
