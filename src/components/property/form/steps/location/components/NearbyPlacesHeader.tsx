
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface NearbyPlacesHeaderProps {
  title: string;
  onFetchAllPlaces: (e: React.MouseEvent) => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export function NearbyPlacesHeader({
  title,
  onFetchAllPlaces,
  isLoading,
  isDisabled
}: NearbyPlacesHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onFetchAllPlaces}
        disabled={isLoading || isDisabled}
        className="flex gap-2 items-center"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Fetching...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4" />
            Get All Nearby Places
          </>
        )}
      </Button>
    </div>
  );
}
