
import { useState, useEffect } from "react";
import { getSvgIconUrl } from "@/utils/iconService";
import { Skeleton } from "@/components/ui/skeleton";

interface IconPreviewProps {
  iconName: string;
  className?: string;
}

export const IconPreview = ({ iconName, className = "" }: IconPreviewProps) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIcon = async () => {
      setIsLoading(true);
      try {
        const url = await getSvgIconUrl(iconName);
        setIconUrl(url);
      } catch (error) {
        console.error(`Error loading icon ${iconName}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    if (iconName) {
      loadIcon();
    }
  }, [iconName]);

  if (isLoading) {
    return <Skeleton className="h-5 w-5 rounded-full" />;
  }

  if (!iconUrl) {
    return <div className={`h-5 w-5 flex items-center justify-center text-xs ${className}`}>{iconName.charAt(0).toUpperCase()}</div>;
  }

  return <img src={iconUrl} alt={iconName} className={`h-5 w-5 ${className}`} />;
};
