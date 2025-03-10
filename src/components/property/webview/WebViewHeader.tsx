
import { Mail, Phone, MapPin } from "lucide-react";
import { AgencySettings } from "@/types/agency";

interface WebViewHeaderProps {
  settings?: AgencySettings;
}

export function WebViewHeader({ settings }: WebViewHeaderProps) {
  return (
    <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        {settings?.logoUrl && (
          <img
            src={settings.logoUrl}
            alt="Agency Logo"
            className="h-12 w-auto object-contain"
          />
        )}
      </div>
      <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 text-xs">
        {settings?.address && (
          <div className="flex items-center gap-1">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: settings?.secondaryColor }}
            >
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-600">{settings.address}</span>
          </div>
        )}
        {settings?.phone && (
          <div className="flex items-center gap-1">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: settings?.secondaryColor }}
            >
              <Phone className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-600">{settings.phone}</span>
          </div>
        )}
        {settings?.email && (
          <div className="flex items-center gap-1">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: settings?.secondaryColor }}
            >
              <Mail className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-600">{settings.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
