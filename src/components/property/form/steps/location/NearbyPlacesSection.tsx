
import { PropertyFormData } from "@/types/property";
import { useNearbyPlacesSection } from "./hooks/useNearbyPlacesSection";
import { NearbyPlacesHeader } from "./components/NearbyPlacesHeader";
import { NearbyPlacesWithTabs } from "./components/NearbyPlacesWithTabs";
import { NearbyPlacesEmptyState } from "./components/NearbyPlacesEmptyState";
import { SelectPlacesModal } from "./components/SelectPlacesModal";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemovePlace?: (index: number) => void;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchNearbyPlaces?: (category?: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
}

export function NearbyPlacesSection({ 
  formData,
  onRemovePlace,
  onFieldChange,
  onFetchNearbyPlaces,
  isLoadingNearbyPlaces = false
}: NearbyPlacesSectionProps) {
  const {
    nearbyPlaces,
    activeTab,
    setActiveTab,
    modalOpen,
    setModalOpen,
    currentCategory,
    placesForModal,
    isFetchingCategory,
    selectedPlacesToDelete,
    categories,
    placesByCategory,
    handleFetchCategory,
    handleSavePlaces,
    togglePlaceVisibility,
    togglePlaceSelection,
    handleBulkDelete,
    handleFetchAllPlaces,
    getMaxSelections
  } = useNearbyPlacesSection({
    formData,
    onFieldChange,
    onFetchNearbyPlaces,
    isLoadingNearbyPlaces
  });

  return (
    <div className="space-y-4">
      <NearbyPlacesHeader 
        title="Nearby Places"
        onFetchAllPlaces={handleFetchAllPlaces}
        isLoading={isLoadingNearbyPlaces || false}
        isDisabled={!formData.address}
      />
      
      {nearbyPlaces.length > 0 ? (
        <NearbyPlacesWithTabs
          nearbyPlaces={nearbyPlaces}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categories={categories}
          placesByCategory={placesByCategory}
          onRemovePlace={onRemovePlace}
          togglePlaceVisibility={togglePlaceVisibility}
          togglePlaceSelection={togglePlaceSelection}
          selectedPlacesToDelete={selectedPlacesToDelete}
          handleBulkDelete={handleBulkDelete}
          handleFetchCategory={handleFetchCategory}
          isFetchingCategory={isFetchingCategory}
          currentCategory={currentCategory}
        />
      ) : (
        <NearbyPlacesEmptyState
          categories={categories}
          handleFetchCategory={handleFetchCategory}
          isFetchingCategory={isFetchingCategory}
          currentCategory={currentCategory}
          formDataAddress={formData.address}
        />
      )}
      
      <SelectPlacesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        places={placesForModal}
        onSave={handleSavePlaces}
        category={currentCategory}
        isLoading={isFetchingCategory}
        maxSelections={5}
      />
    </div>
  );
}
