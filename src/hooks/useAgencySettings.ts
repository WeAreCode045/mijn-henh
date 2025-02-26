
import { useState, useEffect } from "react";
import { AgencySettings } from "@/types/agency";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";
import { defaultAgencySettings } from "@/utils/defaultAgencySettings";
import { useLogoUpload } from "./useLogoUpload";
import { useAgencyFormHandlers } from "./useAgencyFormHandlers";
import { useBackgroundUpload } from "./useBackgroundUpload";
import { useAgencySubmit } from "./useAgencySubmit";

export const useAgencySettings = () => {
  const [settings, setSettings] = useState<AgencySettings>(defaultAgencySettings);
  const { logoPreview, setLogoPreview, handleLogoUpload } = useLogoUpload();
  
  const { handleChange, handleSelectChange } = useAgencyFormHandlers({ 
    setSettings 
  });
  
  const { handlePdfBackgroundUpload, handleWebviewBackgroundUpload } = useBackgroundUpload({ 
    settings, 
    setSettings 
  });
  
  const { isLoading, handleSubmit } = useAgencySubmit({ 
    settings, 
    setSettings, 
    logoPreview 
  });

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchAgencySettings();
      if (data) {
        setSettings(data);
        if (data.logoUrl) {
          setLogoPreview(data.logoUrl);
        }
      }
    };
    loadSettings();
  }, []);

  return {
    settings,
    logoPreview,
    isLoading,
    handleSubmit,
    handleChange,
    handleSelectChange,
    handleLogoUpload,
    handlePdfBackgroundUpload,
    handleWebviewBackgroundUpload,
  };
};
