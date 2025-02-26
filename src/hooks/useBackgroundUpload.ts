
import { useState } from "react";
import { AgencySettings } from "@/types/agency";
import { useToast } from "@/components/ui/use-toast";
import { agencySettingsService } from "@/services/agencySettingsService";

export interface UseBackgroundUploadProps {
  settings: AgencySettings;
  setSettings: React.Dispatch<React.SetStateAction<AgencySettings>>;
}

export const useBackgroundUpload = ({ settings, setSettings }: UseBackgroundUploadProps) => {
  const { toast } = useToast();

  const handlePdfBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const filename = `pdf-bg-${Date.now()}.${file.name.split('.').pop()}`;
      const url = await agencySettingsService.uploadBackground(file, filename);
      
      setSettings(prev => ({
        ...prev,
        pdfBackgroundUrl: url
      }));

      if (settings.id) {
        await agencySettingsService.updateSettings(settings.id, {
          ...settings,
          pdfBackgroundUrl: url
        });
        
        toast({
          title: "Success",
          description: "PDF background image uploaded successfully",
        });
      }
    } catch (error) {
      console.error('Error uploading PDF background image:', error);
      toast({
        title: "Error",
        description: "Failed to upload PDF background image",
        variant: "destructive",
      });
    }
  };

  const handleWebviewBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const filename = `webview-bg-${Date.now()}.${file.name.split('.').pop()}`;
      const url = await agencySettingsService.uploadBackground(file, filename);
      
      setSettings(prev => ({
        ...prev,
        webviewBackgroundUrl: url
      }));

      if (settings.id) {
        await agencySettingsService.updateSettings(settings.id, {
          ...settings,
          webviewBackgroundUrl: url
        });
        
        toast({
          title: "Success",
          description: "Webview background image uploaded successfully",
        });
      }
    } catch (error) {
      console.error('Error uploading webview background image:', error);
      toast({
        title: "Error",
        description: "Failed to upload webview background image",
        variant: "destructive",
      });
    }
  };

  return {
    handlePdfBackgroundUpload,
    handleWebviewBackgroundUpload,
  };
};
