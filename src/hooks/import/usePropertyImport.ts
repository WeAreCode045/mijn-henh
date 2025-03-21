
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyImport({ xmlData, fieldMappings }: { 
  xmlData: any[];
  fieldMappings: Record<string, string>;
}) {
  const [isImporting, setIsImporting] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const { toast } = useToast();

  const togglePropertySelection = (id: number) => {
    setSelectedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(propId => propId !== id) 
        : [...prev, id]
    );
  };

  const selectAllProperties = () => {
    if (selectedProperties.length === xmlData.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(xmlData.map(property => property.id));
    }
  };

  const importProperties = async () => {
    if (selectedProperties.length === 0) {
      toast({
        title: "No properties selected",
        description: "Please select at least one property to import.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const selectedData = xmlData.filter(property => 
        selectedProperties.includes(property.id)
      );

      let imported = 0;
      let updated = 0;
      let errors = 0;

      for (const property of selectedData) {
        try {
          // Map XML fields to property fields using the fieldMappings
          const propertyData: Record<string, any> = {};
          
          Object.entries(fieldMappings).forEach(([propertyField, xmlField]) => {
            if (xmlField && property[xmlField] !== undefined) {
              propertyData[propertyField] = property[xmlField];
            }
          });

          // Process images
          const images = property.images || [];
          const floorplans = property.floorplans || [];
          
          // Set object_id from title if not available
          const objectId = property.id || Math.random().toString(36).substring(2, 9);
          
          // Check if property already exists
          const { data: existingProperty } = await supabase
            .from('properties')
            .select('id')
            .eq('title', propertyData.title)
            .maybeSingle();

          if (existingProperty) {
            // Update existing property
            const { error: updateError } = await supabase
              .from('properties')
              .update(propertyData)
              .eq('id', existingProperty.id);

            if (updateError) {
              console.error("Error updating property:", updateError);
              errors++;
              continue;
            }

            // Handle images for existing property
            if (images.length > 0) {
              // Handle the first image as the main image
              await handlePropertyImages(images, existingProperty.id);
            }

            // Handle floorplans for existing property
            if (floorplans.length > 0) {
              await handlePropertyFloorplans(floorplans, existingProperty.id);
            }

            updated++;
          } else {
            // Insert new property
            const { data: newProperty, error: insertError } = await supabase
              .from('properties')
              .insert(propertyData)
              .select('id')
              .single();

            if (insertError || !newProperty) {
              console.error("Error inserting property:", insertError);
              errors++;
              continue;
            }

            // Handle images for new property
            if (images.length > 0) {
              await handlePropertyImages(images, newProperty.id);
            }

            // Handle floorplans for new property
            if (floorplans.length > 0) {
              await handlePropertyFloorplans(floorplans, newProperty.id);
            }

            imported++;
          }
        } catch (error) {
          console.error("Error processing property:", error);
          errors++;
        }
      }

      const successMessage = [
        imported > 0 ? `${imported} properties imported` : '',
        updated > 0 ? `${updated} properties updated` : '',
        errors > 0 ? `${errors} errors` : ''
      ].filter(Boolean).join(', ');

      toast({
        title: imported > 0 || updated > 0 ? "Import successful" : "Import failed",
        description: successMessage,
        variant: imported > 0 || updated > 0 ? "default" : "destructive",
      });

    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing properties.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Helper function to handle property images
  const handlePropertyImages = async (images: string[], propertyId: string) => {
    try {
      // First clear existing images to avoid duplicates
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId)
        .eq('type', 'image');

      // Add all images
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            url: imageUrl,
            is_main: i === 0, // First image is the main image
            type: 'image',
            sort_order: i
          });
      }
    } catch (error) {
      console.error("Error handling property images:", error);
    }
  };

  // Helper function to handle property floorplans
  const handlePropertyFloorplans = async (floorplans: string[], propertyId: string) => {
    try {
      // First clear existing floorplans to avoid duplicates
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId)
        .eq('type', 'floorplan');

      // Add all floorplans
      for (let i = 0; i < floorplans.length; i++) {
        const floorplanUrl = floorplans[i];
        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            url: floorplanUrl,
            type: 'floorplan',
            sort_order: i
          });
      }
    } catch (error) {
      console.error("Error handling property floorplans:", error);
    }
  };

  return {
    isImporting,
    selectedProperties,
    togglePropertySelection,
    selectAllProperties,
    importProperties
  };
}
