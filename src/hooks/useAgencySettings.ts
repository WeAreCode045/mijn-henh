
import { useState, useEffect, useCallback } from "react";
import { AgencySettings } from "@/types/agency";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";
import { defaultAgencySettings } from "@/utils/defaultAgencySettings";
import { useLogoUpload } from "./useLogoUpload";
import { useAgencyFormHandlers } from "./useAgencyFormHandlers";
import { useBackgroundUpload } from "./useBackgroundUpload";
import { useAgencySubmit } from "./useAgencySubmit";
import { v4 as uuidv4 } from 'uuid';
import { PropertyFeature } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAgencySettings = () => {
  const [settings, setSettings] = useState<AgencySettings>(defaultAgencySettings);
  const [globalFeatures, setGlobalFeatures] = useState<PropertyFeature[]>([]);
  const { logoPreview, setLogoPreview, handleLogoUpload } = useLogoUpload();
  const { toast } = useToast();
  
  const { handleChange, handleSelectChange, handleSwitchChange } = useAgencyFormHandlers({ 
    setSettings 
  });
  
  const { handlePdfBackgroundUpload, handleWebviewBackgroundUpload } = useBackgroundUpload({ 
    settings, 
    setSettings 
  });
  
  const { isLoading, handleSubmit } = useAgencySubmit({ 
    settings, 
    setSettings, 
    logoPreview,
    globalFeatures
  });

  // Fetch global features from the database
  const fetchGlobalFeatures = useCallback(async () => {
    try {
      // Verify user is authenticated before fetching
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        console.log("No authenticated session found in fetchGlobalFeatures");
        return;
      }

      console.log("Fetching global features from property_features table");
      const { data, error } = await supabase
        .from('property_features')
        .select('*')
        .order('description', { ascending: true });
      
      if (error) {
        console.error("Error fetching global features:", error);
        toast({
          title: "Error",
          description: "Failed to fetch global features",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Global features fetched:", data?.length || 0, "items");
      setGlobalFeatures(data || []);
    } catch (error) {
      console.error("Unexpected error fetching global features:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching global features",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Handle adding a new global feature
  const handleGlobalFeatureAdd = async (featureDescription: string) => {
    try {
      const { data, error } = await supabase
        .from('property_features')
        .insert({ description: featureDescription })
        .select()
        .single();
      
      if (error) throw error;
      
      setGlobalFeatures(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Feature added successfully"
      });
    } catch (error) {
      console.error("Error adding global feature:", error);
      toast({
        title: "Error",
        description: "Failed to add feature",
        variant: "destructive"
      });
    }
  };

  // Handle removing a global feature
  const handleGlobalFeatureRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('property_features')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setGlobalFeatures(prev => prev.filter(feature => feature.id !== id));
      toast({
        title: "Success",
        description: "Feature removed successfully"
      });
    } catch (error) {
      console.error("Error removing global feature:", error);
      toast({
        title: "Error",
        description: "Failed to remove feature",
        variant: "destructive"
      });
    }
  };

  // Handle bulk updating global features
  const handleGlobalFeatureBulkUpdate = async (featuresString: string) => {
    try {
      // Parse comma-separated features
      const featureDescriptions = featuresString.split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);
      
      if (featureDescriptions.length === 0) return;
      
      // Create array of feature objects to insert
      const newFeatures = featureDescriptions.map(description => ({
        description
      }));
      
      // Insert features and handle duplicates
      const { data, error } = await supabase
        .from('property_features')
        .insert(newFeatures)
        .select();
      
      if (error) {
        // If there's an error, try to insert one by one to handle duplicates
        for (const description of featureDescriptions) {
          try {
            await supabase
              .from('property_features')
              .insert({ description })
              .select();
          } catch (err) {
            console.error(`Error inserting feature "${description}":`, err);
          }
        }
      }
      
      // Refetch all features to ensure we have the updated list
      await fetchGlobalFeatures();
      
      toast({
        title: "Success",
        description: "Features updated successfully"
      });
    } catch (error) {
      console.error("Error bulk updating features:", error);
      toast({
        title: "Error",
        description: "Failed to update features",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchAgencySettings();
      if (data) {
        setSettings(data);
        if (data.logoUrl) {
          setLogoPreview(data.logoUrl);
        }
      }
      
      // Fetch global features
      await fetchGlobalFeatures();
    };
    loadSettings();
  }, [fetchGlobalFeatures, setLogoPreview]);

  return {
    settings,
    logoPreview,
    isLoading,
    globalFeatures,
    handleSubmit,
    handleChange,
    handleSelectChange,
    handleSwitchChange,
    handleLogoUpload,
    handlePdfBackgroundUpload,
    handleWebviewBackgroundUpload,
    handleGlobalFeatureAdd,
    handleGlobalFeatureRemove,
    handleGlobalFeatureBulkUpdate,
  };
};
