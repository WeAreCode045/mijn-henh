
import { PropertyFormData } from "@/types/property";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectPlacesModal } from "./components/SelectPlacesModal";
import { NearbyPlacesHeader } from "./components/NearbyPlacesHeader";
import { NearbyPlacesTabControls } from "./components/NearbyPlacesTabControls";
import { NearbyPlacesTabContent } from "./components/NearbyPlacesTabContent";
import { EmptyPlacesState } from "./components/EmptyPlacesState";
import { useNearbyPlacesSection } from "./hooks/useNearbyPlacesSection";

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
    handleFetchAllPlaces
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
        <div className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All ({nearbyPlaces.length})</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                  {category.icon}
                  {category.label} ({placesByCategory[category.id]?.length || 0})
                </TabsTrigger>
              ))}
            </TabsList>
            
            <NearbyPlacesTabControls 
              activeTab={activeTab}
              categoryLabel={categories.find(c => c.id === activeTab)?.label}
              selectedCount={selectedPlacesToDelete.length}
              isFetchingCategory={isFetchingCategory}
              onFetchCategory={() => handleFetchCategory(activeTab)}
              onBulkDelete={handleBulkDelete}
            />
            
            <TabsContent value="all" className="space-y-4 mt-4">
              {nearbyPlaces.length > 0 ? (
                <NearbyPlacesTabContent
                  tabId="all-places"
                  category="All Places"
                  places={nearbyPlaces}
                  onRemovePlace={onRemovePlace}
                  toggleVisibility={togglePlaceVisibility}
                  toggleSelection={togglePlaceSelection}
                  selectedIndices={selectedPlacesToDelete}
                  selectionMode={selectedPlacesToDelete.length > 0}
                />
              ) : (
                <p className="text-center py-4 text-muted-foreground">No places found</p>
              )}
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                <NearbyPlacesTabContent
                  tabId={category.id}
                  category={category.label}
                  places={placesByCategory[category.id] || []}
                  onRemovePlace={onRemovePlace}
                  toggleVisibility={togglePlaceVisibility}
                  toggleSelection={togglePlaceSelection}
                  selectedIndices={selectedPlacesToDelete}
                  selectionMode={selectedPlacesToDelete.length > 0}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <EmptyPlacesState />
      )}
      
      <SelectPlacesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        places={placesForModal}
        onSave={handleSavePlaces}
        category={currentCategory}
        isLoading={isFetchingCategory}
      />
    </div>
  );
}
