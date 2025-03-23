
import { Button } from "@/components/ui/button";
import { EmptyPlacesState } from "./EmptyPlacesState";
import { CategoryType } from "../hooks/useCategories";

interface NearbyPlacesEmptyStateProps {
  categories: CategoryType[];
  handleFetchCategory: (categoryId: string, subtypeId?: string) => Promise<void>;
  isFetchingCategory: boolean;
  currentCategory: string;
  formDataAddress?: string;
}

export function NearbyPlacesEmptyState({
  categories,
  handleFetchCategory,
  isFetchingCategory,
  currentCategory,
  formDataAddress
}: NearbyPlacesEmptyStateProps) {
  return (
    <div className="space-y-6">
      <EmptyPlacesState />
      
      {/* Show category buttons even when no places exist */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <div key={category.id} className={`p-4 rounded-lg border ${category.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5" />
                <h3 className="font-medium">{category.label}</h3>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => handleFetchCategory(category.id)}
                disabled={isFetchingCategory || !formDataAddress}
              >
                {isFetchingCategory && currentCategory === category.id ? 
                  'Fetching...' : 
                  `Fetch ${category.label}`
                }
              </Button>
              
              {category.subtypes && category.subtypes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {category.subtypes.map(subtype => (
                    <Button 
                      key={subtype.id}
                      size="sm"
                      variant="secondary"
                      onClick={() => handleFetchCategory(category.id, subtype.id)}
                      disabled={isFetchingCategory || !formDataAddress}
                      className="text-xs mt-1"
                    >
                      {isFetchingCategory && currentCategory === subtype.id ?
                        'Fetching...' :
                        subtype.label
                      }
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
