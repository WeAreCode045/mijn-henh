
import { useState } from "react";
import { PropertyArea, PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

export function useAutoGenerateAreas() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAreasFromDescription = async (
    propertyData: PropertyFormData,
    onAreasGenerated: (areas: PropertyArea[]) => void
  ) => {
    if (!propertyData.description) {
      toast({
        title: "Missing Description",
        description: "Please add a property description first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-property-areas", {
        body: { 
          description: propertyData.description,
          propertyType: propertyData.propertyType
        },
      });

      if (error) throw error;

      if (!data.areas || !Array.isArray(data.areas)) {
        throw new Error("Invalid response from AI");
      }

      // Map the AI response to PropertyArea objects
      const generatedAreas: PropertyArea[] = data.areas.map((area: any) => ({
        id: uuidv4(),
        title: area.title || "",
        name: area.name || "",
        size: area.size || "",
        description: area.description || "",
        images: [],
        imageIds: [],
        columns: 2
      }));

      toast({
        title: "Areas Generated",
        description: `Successfully created ${generatedAreas.length} areas.`,
      });

      onAreasGenerated(generatedAreas);
    } catch (error) {
      console.error("Error generating areas:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate areas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAreasFromDescription,
    isGenerating
  };
}
