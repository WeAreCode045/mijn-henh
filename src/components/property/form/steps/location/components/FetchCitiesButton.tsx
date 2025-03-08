
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";

interface FetchCitiesButtonProps {
  onFetch: () => Promise<void>;
  isLoading: boolean;
}

export function FetchCitiesButton({ onFetch, isLoading }: FetchCitiesButtonProps) {
  return (
    <Button 
      type="button" 
      onClick={(e) => {
        e.preventDefault();
        onFetch();
      }}
      className="flex items-center gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Building2 className="h-4 w-4" />
      )}
      {isLoading ? "Fetching Cities..." : "Get Nearby Cities"}
    </Button>
  );
}
