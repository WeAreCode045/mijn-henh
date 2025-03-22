
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAreaDescriptionGenerator(areaId: string, areaTitle: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywordsForDescription, setKeywordsForDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const generateDescription = async () => {
    if (!keywordsForDescription.trim()) {
      toast({
        title: "Missing keywords",
        description: "Please enter at least one keyword to generate a description",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      const keywords = keywordsForDescription
        .split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      const { data, error } = await supabase.functions.invoke('generate-area-description', {
        body: {
          keywords: keywords,
          areaName: areaTitle || "Area",
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.description) {
        setIsDialogOpen(false);
        toast({
          title: "Description generated",
          description: "The area description has been generated successfully",
        });
        return data.description;
      }
      return null;
    } catch (err) {
      console.error("Error generating description:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate description",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { 
    isGenerating, 
    keywordsForDescription, 
    setKeywordsForDescription, 
    isDialogOpen, 
    setIsDialogOpen, 
    generateDescription 
  };
}
