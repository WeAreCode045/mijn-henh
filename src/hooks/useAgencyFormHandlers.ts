
import { AgencySettings } from "@/types/agency";

interface UseAgencyFormHandlersProps {
  setSettings: React.Dispatch<React.SetStateAction<AgencySettings>>;
}

export const useAgencyFormHandlers = ({ setSettings }: UseAgencyFormHandlersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
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
