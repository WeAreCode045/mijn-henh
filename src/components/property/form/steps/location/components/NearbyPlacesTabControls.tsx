
import { Button } from "@/components/ui/button";
import { MapPin, Trash2 } from "lucide-react";

interface NearbyPlacesTabControlsProps {
  activeTab: string;
  categoryLabel?: string;
  selectedCount: number;
  isFetchingCategory: boolean;
  onFetchCategory?: () => void;
  onBulkDelete?: () => void;
}

export function NearbyPlacesTabControls({
  activeTab,
  categoryLabel,
  selectedCount,
  isFetchingCategory,
  onFetchCategory,
  onBulkDelete
}: NearbyPlacesTabControlsProps) {
  return (
    <div className="flex justify-between mt-2">
      {activeTab !== 'all' && onFetchCategory && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onFetchCategory}
          disabled={isFetchingCategory}
        >
          {isFetchingCategory ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
              Fetching...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Fetch {categoryLabel}
            </>
          )}
        </Button>
      )}
      
      {selectedCount > 0 && onBulkDelete && (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onBulkDelete}
          className="ml-auto"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected ({selectedCount})
        </Button>
      )}
    </div>
  );
}
