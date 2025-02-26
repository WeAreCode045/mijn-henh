
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";

export interface WebViewSectionProps {
  property: PropertyData;
  settings?: AgencySettings;
  waitForPlaces?: boolean;
  setSelectedImage?: (image: string | null) => void;
}

export interface WebViewDialogProps {
  property: PropertyData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
