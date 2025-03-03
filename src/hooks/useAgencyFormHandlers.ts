
import { AgencySettings } from "@/types/agency";

export interface UseAgencyFormHandlersProps {
  setSettings: React.Dispatch<React.SetStateAction<AgencySettings>>;
}

export const useAgencyFormHandlers = ({ setSettings }: UseAgencyFormHandlersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Map field names to settings properties if needed
    let settingsField = name;
    
    if (name.startsWith('appwrite_')) {
      // Handle Appwrite fields
      settingsField = name;
    }
    
    setSettings((prev) => ({
      ...prev,
      [settingsField]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return {
    handleChange,
    handleSelectChange,
    handleSwitchChange
  };
};
