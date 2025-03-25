
import { AgencySettings } from "@/types/agency";
import { defaultAgencySettings } from "@/utils/defaultAgencySettings";

/**
 * Format number with commas for thousands
 */
export const formatNumber = (num?: number | string) => {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Convert string to number for comparison
 */
export const parseValueToNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get energy label image path based on energy class
 */
export const getEnergyLabelImagePath = (energyLabel?: string) => {
  if (!energyLabel) return null;
  return `https://gjvpptmwijiosgdcozep.supabase.co/storage/v1/object/public/global/energy/${energyLabel.toUpperCase()}.png`;
};

/**
 * Get safe settings with defaults
 */
export const getSafeSettings = (settings?: AgencySettings): AgencySettings => {
  // Using defaultAgencySettings for colors if settings is undefined
  return settings || {
    ...defaultAgencySettings,
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    primaryColor: defaultAgencySettings.primaryColor,
    secondaryColor: defaultAgencySettings.secondaryColor,
    iconBuildYear: "calendar",
    iconBedrooms: "bed",
    iconBathrooms: "bath",
    iconGarages: "car",
    iconEnergyClass: "zap",
    iconSqft: "ruler",
    iconLivingSpace: "home"
  };
};
