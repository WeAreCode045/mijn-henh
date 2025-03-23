
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MapPin } from "lucide-react";
import { PropertyFormData } from "@/types/property";
import { NearbyPlacesList } from './components/NearbyPlacesList';
import { SelectCategoryModal } from './components/SelectCategoryModal';

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchLocationData?: () => Promise<void>;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
}

export function NearbyPlacesSection({
  formData,
  onFetchCategoryPlaces,
  onFetchLocationData,
  onFieldChange,
  onRemoveNearbyPlace,
  isLoadingLocationData
}: NearbyPlacesSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  
  const nearbyPlaces = formData.nearby_places || [];
  
  const handleSelectCategory = async (category: string) => {
    if (!onFetchCategoryPlaces) return;
    
    setIsLoadingCategory(true);
    
    try {
      const results = await onFetchCategoryPlaces(category);
      setModalOpen(false);
    } catch (error) {
      console.error("Error fetching category places:", error);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Nearby Places</h3>
        
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            if (onFetchCategoryPlaces) {
              setModalOpen(true);
            } else if (onFetchLocationData) {
              onFetchLocationData();
            }
          }}
          disabled={isLoadingLocationData || isLoadingCategory || !formData.address}
          className="flex gap-2 items-center"
        >
          {isLoadingLocationData || isLoadingCategory ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Fetching...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Fetch Places
            </>
          )}
        </Button>
      </div>
      
      {nearbyPlaces.length > 0 ? (
        <NearbyPlacesList 
          places={nearbyPlaces} 
          onRemovePlace={onRemoveNearbyPlace}
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Alert variant="default" className="bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                No nearby places data available. Use the "Fetch Places" button to discover places near this property.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
      
      {/* Category selection modal */}
      <SelectCategoryModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectCategory={handleSelectCategory}
        isLoading={isLoadingCategory}
      />
    </div>
  );
}
