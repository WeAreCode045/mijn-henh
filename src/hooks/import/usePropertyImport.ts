
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { preparePropertyDataForSubmission } from "@/hooks/property-form/utils/propertyDataFormatter";

interface UsePropertyImportProps {
  xmlData: any[];
  fieldMappings: Record<string, string>;
}

export const usePropertyImport = ({ xmlData, fieldMappings }: UsePropertyImportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const togglePropertySelection = (id: number) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(propId => propId !== id));
    } else {
      setSelectedProperties([...selectedProperties, id]);
    }
  };

  const selectAllProperties = () => {
    if (selectedProperties.length === xmlData.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(xmlData.map(prop => prop.id));
    }
  };

  const downloadAndStoreImage = async (url: string, propertyId: string, isFloorplan: boolean = false): Promise<string | null> => {
    try {
      // Use the edge function to download and store the image
      const { data: { session } } = await supabase.auth.getSession();
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-image`;

      console.log(`Downloading ${isFloorplan ? 'floorplan' : 'image'} from URL:`, url);

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ 
          imageUrl: url,
          propertyId,
          folder: isFloorplan ? 'floorplans' : 'photos'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to download image: ${errorData.error || response.statusText}`);
      }

      const { publicUrl, error } = await response.json();
      if (error) throw new Error(error);

      console.log(`Successfully downloaded and stored ${isFloorplan ? 'floorplan' : 'image'}:`, publicUrl);
      return publicUrl;
    } catch (error) {
      console.error(`Error downloading/storing ${isFloorplan ? 'floorplan' : 'image'}:`, error);
      return null;
    }
  };

  const importProperties = async () => {
    try {
      setIsImporting(true);
      
      // Filter only selected properties
      const propertiesToImport = xmlData.filter(prop => 
        selectedProperties.includes(prop.id)
      );
      
      if (propertiesToImport.length === 0) {
        toast({
          title: "No Properties Selected",
          description: "Please select at least one property to import.",
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }
      
      // Import each property
      const results = await Promise.all(
        propertiesToImport.map(async (xmlProp) => {
          try {
            // Map XML fields to property fields based on the fieldMappings
            const propertyData: Record<string, any> = {
              status: "Draft",
              metadata: { status: "Draft" },
            };
            
            // Apply field mappings
            for (const [propertyField, xmlField] of Object.entries(fieldMappings)) {
              if (xmlField && xmlProp[xmlField]) {
                propertyData[propertyField] = xmlProp[xmlField];
              }
            }
            
            // Format the property data for submission
            const formattedData = preparePropertyDataForSubmission(propertyData);
            
            // Insert into database to get the property ID
            const { data, error } = await supabase
              .from('properties')
              .insert(formattedData)
              .select()
              .single();
              
            if (error) {
              console.error("Error importing property:", error);
              return { success: false, error };
            }
            
            const propertyId = data.id;
            
            // Process images
            if (xmlProp.images && xmlProp.images.length > 0) {
              const imageUrls = [];
              let featuredImageUrl = null;
              
              for (const imageUrl of xmlProp.images) {
                const storedUrl = await downloadAndStoreImage(imageUrl, propertyId, false);
                if (storedUrl) {
                  imageUrls.push(storedUrl);
                  if (!featuredImageUrl) {
                    featuredImageUrl = storedUrl;
                  }
                  
                  // Create property_images record
                  await supabase.from('property_images').insert({
                    property_id: propertyId,
                    url: storedUrl,
                    type: 'image',
                    sort_order: imageUrls.length
                  });
                }
              }
              
              // Update property with featured image
              if (imageUrls.length > 0 && featuredImageUrl) {
                await supabase
                  .from('properties')
                  .update({
                    "featuredImage": featuredImageUrl
                  })
                  .eq('id', propertyId);
              }
            }
            
            // Process floorplans
            if (xmlProp.floorplans && xmlProp.floorplans.length > 0) {
              for (const floorplanUrl of xmlProp.floorplans) {
                const storedUrl = await downloadAndStoreImage(floorplanUrl, propertyId, true);
                if (storedUrl) {
                  // Create property_floorplans record
                  const { error } = await supabase
                    .from('property_floorplans')
                    .insert({
                      property_id: propertyId,
                      url: storedUrl,
                      sort_order: 1
                    });
                    
                  if (error) {
                    console.error("Error saving floorplan:", error);
                  }
                }
              }
            }
            
            return { success: true, data };
          } catch (error) {
            console.error("Error processing property:", error);
            return { success: false, error };
          }
        })
      );
      
      // Count successful imports
      const successCount = results.filter(result => result.success).length;
      
      toast({
        title: "Import Completed",
        description: `Successfully imported ${successCount} out of ${propertiesToImport.length} properties.`,
        variant: successCount > 0 ? "default" : "destructive",
      });
      
      if (successCount > 0) {
        // Navigate to properties page after successful import
        setTimeout(() => navigate("/properties"), 2000);
      }
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the properties.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    selectedProperties,
    togglePropertySelection,
    selectAllProperties,
    importProperties
  };
};
