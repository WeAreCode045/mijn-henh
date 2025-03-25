
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgencyTab } from "./AgencyTab";
import { DesignTab } from "./DesignTab";
import { AdvancedTab } from "./AdvancedTab";
import { GlobalTab } from "./GlobalTab";
import { AgencySettings } from "@/types/agency";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";
import { updateAgencySettings } from "@/services/agencySettingsService";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { SettingsTab } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFeature } from "@/types/property";

export function SettingsPage() {
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>("agency");
  const [globalFeatures, setGlobalFeatures] = useState<PropertyFeature[]>([]);
  const { toast } = useToast();

  // Fetch settings
  useEffect(() => {
    const getSettings = async () => {
      try {
        setIsLoading(true);
        const agencySettings = await fetchAgencySettings();
        setSettings(agencySettings);
        
        // Also fetch global features
        await fetchGlobalFeatures();
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getSettings();
  }, [toast]);

  // Fetch global features from database
  const fetchGlobalFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('property_features')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setGlobalFeatures(data as PropertyFeature[]);
    } catch (error) {
      console.error("Error fetching global features:", error);
      toast({
        title: "Error",
        description: "Failed to load global features",
        variant: "destructive",
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (settings) {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    if (settings) {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (settings) {
      setSettings({
        ...settings,
        [name]: checked,
      });
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!settings) return;
    
    try {
      await updateAgencySettings(settings);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  // Handle global feature add
  const handleFeatureAdd = async (description: string) => {
    try {
      const { data, error } = await supabase
        .from('property_features')
        .insert({ description })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Feature added",
        description: "Global feature has been added successfully",
      });
      
      await fetchGlobalFeatures();
    } catch (error) {
      console.error("Error adding feature:", error);
      toast({
        title: "Error",
        description: "Failed to add feature. It might already exist.",
        variant: "destructive",
      });
    }
  };

  // Handle global feature remove
  const handleFeatureRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('property_features')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Feature removed",
        description: "Global feature has been removed successfully",
      });
      
      await fetchGlobalFeatures();
    } catch (error) {
      console.error("Error removing feature:", error);
      toast({
        title: "Error",
        description: "Failed to remove feature",
        variant: "destructive",
      });
    }
  };

  // Handle bulk feature update
  const handleFeatureBulkUpdate = async (featuresStr: string) => {
    try {
      const featuresList = featuresStr
        .split(',')
        .map(f => f.trim())
        .filter(f => f);
      
      if (featuresList.length === 0) return;
      
      // Insert all features (we'll handle duplicates in the database)
      const { error } = await supabase.rpc('upsert_features', {
        feature_descriptions: featuresList
      });
      
      if (error) throw error;
      
      toast({
        title: "Features updated",
        description: "Global features have been updated successfully",
      });
      
      await fetchGlobalFeatures();
    } catch (error) {
      console.error("Error updating features:", error);
      toast({
        title: "Error",
        description: "Failed to update features",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-xl text-muted-foreground">Failed to load settings</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs
        defaultValue="agency"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SettingsTab)}
      >
        <TabsList className="w-full border-b mb-8">
          <TabsTrigger value="agency">Agency</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agency">
          <AgencyTab
            settings={settings}
            onInputChange={handleInputChange}
            onSave={handleSave}
          />
        </TabsContent>
        
        <TabsContent value="design">
          <DesignTab
            settings={settings}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onSave={handleSave}
          />
        </TabsContent>
        
        <TabsContent value="global">
          <GlobalTab
            settings={settings}
            onSelectChange={handleSelectChange}
            globalFeatures={globalFeatures}
            onFeatureAdd={handleFeatureAdd}
            onFeatureRemove={handleFeatureRemove}
            onFeatureBulkUpdate={handleFeatureBulkUpdate}
          />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedTab
            settings={settings}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            onSave={handleSave}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
