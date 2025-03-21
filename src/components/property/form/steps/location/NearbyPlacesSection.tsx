
import { PropertyFormData } from "@/types/property";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectPlacesModal } from "./components/SelectPlacesModal";
import { NearbyPlacesHeader } from "./components/NearbyPlacesHeader";
import { NearbyPlacesTabControls } from "./components/NearbyPlacesTabControls";
import { NearbyPlacesTabContent } from "./components/NearbyPlacesTabContent";
import { EmptyPlacesState } from "./components/EmptyPlacesState";
import { useNearbyPlacesSection } from "./hooks/useNearbyPlacesSection";
import { Button } from "@/components/ui/button";
import { CategoryType } from "./hooks/useCategories";

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

  // Render subtypes for a category
  const renderSubtypeButtons = (category: CategoryType) => {
    if (!category.subtypes) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {category.subtypes.map(subtype => (
          <Button 
            key={subtype.id}
            size="sm"
            variant="outline"
            onClick={() => handleFetchCategory(category.id, subtype.id)}
            disabled={isFetchingCategory}
            className="text-xs"
          >
            Fetch {subtype.label} (max {subtype.maxSelections})
          </Button>
        ))}
      </div>
    );
  };

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
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    {category.label} ({placesByCategory[category.id]?.length || 0})
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            <div className="mt-4">
              {activeTab !== 'all' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline"
                      onClick={() => handleFetchCategory(activeTab)}
                      disabled={isFetchingCategory}
                    >
                      {isFetchingCategory ? 'Fetching...' : `Fetch All ${categories.find(c => c.id === activeTab)?.label}`}
                    </Button>
                    
                    {selectedPlacesToDelete.length > 0 && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleBulkDelete}
                        className="ml-auto"
                      >
                        Delete Selected ({selectedPlacesToDelete.length})
                      </Button>
                    )}
                  </div>
                  
                  {/* Render subtype buttons if available */}
                  {renderSubtypeButtons(categories.find(c => c.id === activeTab) as CategoryType)}
                </div>
              )}
            </div>
            
            <TabsContent value="all" className="space-y-4">
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
              <TabsContent key={category.id} value={category.id} className="space-y-4">
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
        maxSelections={getMaxSelections(currentCategory)}
      />
    </div>
  );
}
