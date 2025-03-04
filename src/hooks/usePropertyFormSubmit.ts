
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData, PropertySubmitData } from "@/types/property";
import { usePropertyValidation } from "./property-form/usePropertyValidation";
import { usePropertyDatabase } from "./property-form/usePropertyDatabase";
import { supabase } from "@/integrations/supabase/client"; 
import { 
  prepareAreasForFormSubmission, 
  preparePropertiesForJsonField,
  prepareFloorplansForFormSubmission
} from "./property-form/preparePropertyData";

export function usePropertyFormSubmit() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validatePropertyData } = usePropertyValidation();
  const { updateProperty, createProperty } = usePropertyDatabase();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData, shouldRedirect = false) => {
    // Prevent the default form submission behavior
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    console.log("usePropertyFormSubmit - handleSubmit called with formData:", formData);
    
    if (!formData.id) {
      // For new properties, require basic validation
      if (!validatePropertyData(formData)) {
        return false;
      }
    }
    
    // Prepare data for submission using our utility functions
    const areasForSubmission = prepareAreasForFormSubmission(formData.areas);
    const featuresJson = preparePropertiesForJsonField(formData.features);
    const nearby_placesJson = preparePropertiesForJsonField(formData.nearby_places);
    const floorplansJson = prepareFloorplansForFormSubmission(formData.floorplans);
    
    console.log("usePropertyFormSubmit - Form submission - areas:", areasForSubmission);
    console.log("usePropertyFormSubmit - Form submission - features:", featuresJson);
    
    // We still include featuredImage and gridImages in the submission data for backward compatibility
    // But we now also update the property_images table directly
    const submitData: PropertySubmitData = {
      title: formData.title,
      price: formData.price,
      address: formData.address,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      sqft: formData.sqft,
      livingArea: formData.livingArea,
      buildYear: formData.buildYear,
      garages: formData.garages,
      energyLabel: formData.energyLabel,
      hasGarden: formData.hasGarden,
      description: formData.description,
      location_description: formData.location_description,
      features: featuresJson,
      featuredImage: formData.featuredImage, // Keep for backward compatibility
      gridImages: formData.gridImages, // Keep for backward compatibility
      map_image: formData.map_image,
      latitude: formData.latitude,
      longitude: formData.longitude,
      areas: areasForSubmission,
      nearby_places: nearby_placesJson,
      images: formData.images.map(img => typeof img === 'string' ? img : img.url),
      object_id: formData.object_id,
      agent_id: formData.agent_id,
      template_id: formData.template_id,
      virtualTourUrl: formData.virtualTourUrl,
      youtubeUrl: formData.youtubeUrl,
      notes: formData.notes,
      // Make sure floorplanEmbedScript is explicitly included
      floorplanEmbedScript: formData.floorplanEmbedScript || "",
      // Add floorplans field to satisfy the type
      floorplans: floorplansJson
    };
    
    console.log("usePropertyFormSubmit - Final submit data:", submitData);
    
    let success = false;
    if (formData.id) {
      success = await updateProperty(formData.id, submitData);
      
      // Update property_images table to set is_featured and is_grid_image flags
      if (success) {
        try {
          // Reset all image flags first
          await supabase
            .from('property_images')
            .update({ is_featured: false, is_grid_image: false })
            .eq('property_id', formData.id);
          
          // Set featured image
          if (formData.featuredImage) {
            console.log("Setting featured image in database:", formData.featuredImage);
            const { error } = await supabase
              .from('property_images')
              .update({ is_featured: true })
              .eq('property_id', formData.id)
              .eq('url', formData.featuredImage);
              
            if (error) {
              console.error("Error setting featured image:", error);
            }
          }
          
          // Set grid images
          if (formData.gridImages && formData.gridImages.length > 0) {
            for (const imageUrl of formData.gridImages) {
              console.log("Setting grid image in database:", imageUrl);
              const { error } = await supabase
                .from('property_images')
                .update({ is_grid_image: true })
                .eq('property_id', formData.id)
                .eq('url', imageUrl);
                
              if (error) {
                console.error("Error setting grid image:", error);
              }
            }
          }
          
          // For each floorplan in formData.floorplans, make sure it exists in property_images
          if (formData.floorplans && formData.floorplans.length > 0) {
            for (const floorplan of formData.floorplans) {
              // Check if this floorplan already exists in property_images
              const { data: existingFloorplan } = await supabase
                .from('property_images')
                .select('*')
                .eq('property_id', formData.id)
                .eq('url', floorplan.url)
                .eq('type', 'floorplan')
                .maybeSingle();
                
              if (!existingFloorplan) {
                // Insert new floorplan record
                await supabase
                  .from('property_images')
                  .insert({
                    property_id: formData.id,
                    url: floorplan.url,
                    type: 'floorplan'
                  });
              }
            }
          }
        } catch (error) {
          console.error("Error updating image flags:", error);
        }
      }
    } else {
      success = await createProperty(submitData);
      
      // If successful creation, add all images to property_images table
      if (success) {
        // Get the newly created property ID
        const { data: newProperty } = await supabase
          .from('properties')
          .select('id')
          .eq('title', formData.title)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (newProperty && newProperty.id) {
          try {
            // Add all images to property_images table
            for (const image of formData.images) {
              const imageUrl = typeof image === 'string' ? image : image.url;
              await supabase
                .from('property_images')
                .insert({
                  property_id: newProperty.id,
                  url: imageUrl,
                  is_featured: formData.featuredImage === imageUrl,
                  is_grid_image: formData.gridImages?.includes(imageUrl) || false,
                  type: 'image'
                });
            }
            
            // Add all floorplans to property_images table
            for (const floorplan of formData.floorplans || []) {
              await supabase
                .from('property_images')
                .insert({
                  property_id: newProperty.id,
                  url: floorplan.url,
                  type: 'floorplan'
                });
            }
          } catch (error) {
            console.error("Error adding images to property_images table:", error);
          }
        }
      }
      
      // Only redirect to home page after creating a new property if shouldRedirect is true
      if (success && shouldRedirect) {
        navigate('/');
      }
    }
    
    console.log("usePropertyFormSubmit - Submission result:", success ? "Success" : "Failed");
    return success;
  };

  return { handleSubmit };
}
