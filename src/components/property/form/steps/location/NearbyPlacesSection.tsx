import { PropertyFormData } from "@/types/property";
import { useNearbyPlacesSection } from "./hooks/useNearbyPlacesSection";
import { NearbyPlacesHeader } from "./components/NearbyPlacesHeader";
import { NearbyPlacesWithTabs } from "./components/NearbyPlacesWithTabs";
import { NearbyPlacesEmptyState } from "./components/NearbyPlacesEmptyState";
import { SelectPlacesModal } from "../components/SelectPlacesModal";

interface NearbyPlacesSectionProps {
  formData: PropertyFormData;
  onRemovePlace?: (index: number) => void;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchNearbyPlaces?: (category?: string) => Promise<any>;
  isLoadingNearbyPlaces?: boolean;
  isReadOnly?: boolean;
}

export function NearbyPlacesSection({ 
  formData,
  onRemovePlace,
  onFieldChange,
  onFetchNearbyPlaces,
  isLoadingNearbyPlaces = false,
  isReadOnly = false
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
    isLoadingNearbyPlaces,
    isReadOnly
  });

  return (
    <div className="space-y-4">
      <NearbyPlacesHeader 
        title="Nearby Places"
        onFetchAllPlaces={handleFetchAllPlaces}
        isLoading={isLoadingNearbyPlaces || false}
        isDisabled={!formData.address || isReadOnly}
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
          isReadOnly={isReadOnly}
        />
      ) : (
        <NearbyPlacesEmptyState
          categories={categories}
          handleFetchCategory={handleFetchCategory}
          isFetchingCategory={isFetchingCategory}
          currentCategory={currentCategory}
          formDataAddress={formData.address}
          isReadOnly={isReadOnly}
        />
      )}
      
      <SelectPlacesModal
        isOpen={modalOpen && !isReadOnly}
        onClose={() => setModalOpen(false)}
        places={placesForModal}
        onSave={handleSavePlaces}
        category={currentCategory}
        isLoading={isFetchingCategory}
        maxSelections={getMaxSelections(currentCategory)}
      />
    </div>
  );
}
