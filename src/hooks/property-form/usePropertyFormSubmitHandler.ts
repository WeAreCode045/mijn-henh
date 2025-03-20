
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyValidation } from "./usePropertyValidation";
import { useNavigate } from "react-router-dom";
import { usePropertyImageSaver } from "./usePropertyImageSaver";
import { usePropertyDataPreparer } from "./usePropertyDataPreparer";
import { usePropertyDatabase } from "./usePropertyDatabase";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyFormSubmitHandler() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validatePropertyData } = usePropertyValidation();
  const { savePropertyImages, savePropertyFloorplans } = usePropertyImageSaver();
  const { prepareSubmitData } = usePropertyDataPreparer();
  const { updateProperty, createProperty } = usePropertyDatabase();
  const { logPropertyChanges } = usePropertyEditLogger();

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
      let updatedPropertyData = null;
      
      if (formData.id) {
        // Get the current property data before updating to compare changes
        const { data: currentPropertyData } = await supabase
          .from('properties')
          .select('*')
          .eq('id', formData.id)
          .single();
          
        // Update existing property
        success = await updateProperty(formData.id, submitData);
        
        // Retrieve the updated property to get the new updated_at timestamp
        if (success) {
          const { data: freshPropertyData } = await supabase
            .from('properties')
            .select('*')
            .eq('id', formData.id)
            .single();
            
          updatedPropertyData = freshPropertyData;
          
          // Log the changes if update was successful
          if (currentPropertyData) {
            await logPropertyChanges(formData.id, currentPropertyData, submitData);
          }
          
          // Save or update featured images
          await savePropertyImages(formData);
        }
      } else {
        // Create new property
        success = await createProperty(submitData);
        
        if (success) {
          const newPropertyId = await getNewPropertyId(formData.title);
          
          if (newPropertyId) {
            // Retrieve the new property data
            const { data: freshPropertyData } = await supabase
              .from('properties')
              .select('*')
              .eq('id', newPropertyId)
              .single();
              
            updatedPropertyData = freshPropertyData;
            
            // Save images for new property
            await saveAllImagesForNewProperty(newPropertyId, formData);
          }
        }
        
        if (success && shouldRedirect) {
          navigate('/');
        }
      }
      
      console.log("usePropertyFormSubmit - Submission result:", success ? "Success" : "Failed");
      console.log("usePropertyFormSubmit - Updated timestamp:", updatedPropertyData?.updated_at);
      
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
  const { data: newProperty } = await supabase
    .from('properties')
    .select('id')
    .eq('title', title)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  return newProperty?.id || null;
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
