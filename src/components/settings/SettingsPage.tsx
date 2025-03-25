import { useState, useEffect, ChangeEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgencyTab } from "./AgencyTab";
import { DesignTab } from "./DesignTab";
import { AdvancedTab } from "./AdvancedTab";
import { GlobalTab } from "./GlobalTab";
import { AgencySettings } from "@/types/agency";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SettingsTab } from "@/types/settings";
import { PropertyFeature } from "@/types/property";
import { IconSettings } from "./IconSettings";

export function SettingsPage() {
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>("agency");
  const [globalFeatures, setGlobalFeatures] = useState<PropertyFeature[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const getSettings = async () => {
      try {
        setIsLoading(true);
        const agencySettings = await fetchAgencySettings();
        setSettings(agencySettings);
        
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (settings) {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (settings) {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (settings) {
      setSettings({
        ...settings,
        [name]: checked,
      });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      let globalFeaturesData: string[] = [];
      if (Array.isArray(settings.globalFeatures)) {
        globalFeaturesData = settings.globalFeatures;
      }
      
      const { error } = await supabase
        .from('agency_settings')
        .update({
          name: settings.name,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          primary_color: settings.primaryColor,
          secondary_color: settings.secondaryColor,
          logo_url: settings.logoUrl,
          description_background_url: settings.webviewBgImage,
          facebook_url: settings.facebookUrl,
          instagram_url: settings.instagramUrl,
          youtube_url: settings.youtubeUrl,
          google_maps_api_key: settings.googleMapsApiKey,
          xml_import_url: settings.xmlImportUrl,
          icon_bedrooms: settings.iconBedrooms,
          icon_bathrooms: settings.iconBathrooms,
          icon_sqft: settings.iconSqft,
          icon_living_space: settings.iconLivingSpace,
          icon_build_year: settings.iconBuildYear,
          icon_garages: settings.iconGarages,
          icon_energy_class: settings.iconEnergyClass,
          smtp_host: settings.smtpHost,
          smtp_port: settings.smtpPort,
          smtp_username: settings.smtpUsername,
          smtp_password: settings.smtpPassword,
          smtp_from_email: settings.smtpFromEmail,
          smtp_from_name: settings.smtpFromName,
          smtp_secure: settings.smtpSecure,
          openai_api_key: settings.openaiApiKey,
          global_features: globalFeaturesData
        })
        .eq('id', settings.id);
      
      if (error) throw error;
      
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

  const handleFeatureBulkUpdate = async (featuresStr: string) => {
    try {
      const featuresList = featuresStr
        .split(',')
        .map(f => f.trim())
        .filter(f => f);
      
      if (featuresList.length === 0) return;
      
      for (const description of featuresList) {
        try {
          await supabase
            .from('property_features')
            .insert({ description })
            .select();
        } catch (error) {
          console.error(`Error inserting feature "${description}":`, error);
        }
      }
      
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
          <TabsTrigger value="icons">Icons</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agency">
          <AgencyTab
            settings={settings}
            logoPreview=""
            onChange={handleInputChange}
            onLogoUpload={() => {}}
          />
          <button 
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Save Changes
          </button>
        </TabsContent>
        
        <TabsContent value="design">
          <DesignTab
            settings={settings}
            onChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onPdfBackgroundUpload={() => {}}
            onWebviewBackgroundUpload={() => {}}
          />
          <button 
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Save Changes
          </button>
        </TabsContent>
        
        <TabsContent value="icons">
          <IconSettings 
            settings={settings} 
            onSelectChange={handleSelectChange} 
          />
          <button 
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Save Changes
          </button>
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
          <button 
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Save Changes
          </button>
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedTab
            settings={settings}
            onChange={handleInputChange}
            onSwitchChange={handleCheckboxChange}
          />
          <button 
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Save Changes
          </button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
