
import { useEffect, useState } from "react";
import { getSvgIconUrl } from "@/utils/iconService";

interface PropertyDetailCardProps {
  iconName: string;
  label: string;
  value: string | number;
  unit?: string;
  primaryColor: string;
}

export function PropertyDetailCard({ iconName, label, value, unit = "", primaryColor }: PropertyDetailCardProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchIcon = async () => {
      try {
        const url = await getSvgIconUrl(iconName, 'dark');
        if (url) {
          setIconUrl(url);
        }
      } catch (error) {
        console.error(`Error fetching icon ${iconName}:`, error);
      }
    };
    
    fetchIcon();
  }, [iconName]);
  
  return (
    <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: primaryColor }}>
      <div className="webview-detail-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
        {iconUrl ? (
          <img 
            src={iconUrl} 
            alt={label} 
            className="w-6 h-6" 
          />
        ) : (
          <span className="w-6 h-6 flex items-center justify-center">{label.charAt(0)}</span>
        )}
      </div>
      <div>
        <p className="text-xs text-white/80">{label}</p>
        <p className="font-medium text-white">
          {value}{unit && ` ${unit}`}
        </p>
      </div>
    </div>
  );
}
