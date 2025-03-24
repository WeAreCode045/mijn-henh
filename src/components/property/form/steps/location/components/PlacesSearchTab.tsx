
import React, { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface PlacesSearchTabProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchPlaces?: (category: string) => Promise<any>;
  isLoading?: boolean;
  onSearchClick?: (e: React.MouseEvent<HTMLButtonElement>, category: string) => Promise<any>;
}

// A simple temporary modal component until we rebuild the feature
function BasicPlacesModal({
  isOpen,
  onClose,
  isLoading
}: {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Places Search</DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading places...</p>
            </div>
          ) : (
            <p className="text-center">Nearby places functionality is being rebuilt.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PlacesSearchTab({
  formData,
  onFieldChange,
  onFetchPlaces,
  isLoading = false,
  onSearchClick
}: PlacesSearchTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { toast } = useToast();

  // Combine external and local loading states
  const combinedIsLoading = isLoading || localIsLoading;

  // Reset local loading when external loading changes
  useEffect(() => {
    if (!isLoading) {
      setLocalIsLoading(false);
    }
  }, [isLoading]);

  const handleOpenModal = () => {
    // Validate that we have coordinates and property ID
    if (!formData.latitude || !formData.longitude) {
      console.error("Cannot open modal: missing coordinates");
      toast({
        title: "Error",
        description: "Property coordinates are required to search for places",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.id) {
      console.error("Cannot open modal: missing property ID");
      toast({
        title: "Error",
        description: "Please save the property first before searching for places",
        variant: "destructive"
      });
      return;
    }
    
    setShowModal(true);
  };

  const hasCoordinates = !!(formData.latitude && formData.longitude);
  const hasPropertyId = !!formData.id;
  const canSearch = hasCoordinates && hasPropertyId;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Find and add places of interest near this property.
      </p>
      
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={handleOpenModal}
          disabled={combinedIsLoading || !canSearch}
        >
          {combinedIsLoading ? "Loading..." : "Find Places"}
        </Button>
      </div>
      
      {!hasCoordinates && (
        <p className="text-sm text-destructive text-center">
          Please enter property coordinates before searching for nearby places.
        </p>
      )}
      
      {!hasPropertyId && (
        <p className="text-sm text-destructive text-center">
          Please save the property first before searching for nearby places.
        </p>
      )}
      
      <BasicPlacesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isLoading={combinedIsLoading}
      />
    </div>
  );
}
