
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

export interface WebViewSectionProps {
  property: PropertyData;
  settings: AgencySettings;
  isPrintView?: boolean;
  waitForPlaces?: boolean;
  currentAreaId?: string;
}
