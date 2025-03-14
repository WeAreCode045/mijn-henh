
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

interface FetchCitiesButtonProps {
  onFetch?: () => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function FetchCitiesButton({ 
  onFetch, 
  isLoading = false,
  disabled = false
}: FetchCitiesButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        if (onFetch) onFetch();
      }}
      disabled={isLoading || disabled}
      className="flex gap-2 items-center"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching...
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4" />
          Fetch Cities
        </>
      )}
    </Button>
  );
}
