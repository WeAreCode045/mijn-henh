
import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Coffee, Utensils, School, Building, Stethoscope, 
  ShoppingCart, Bus, Park, Bank, Building2, Landmark 
} from "lucide-react";

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => Promise<any>;
  isLoading?: boolean;
}

type CategoryOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export function SelectCategoryModal({
  isOpen,
  onClose,
  onSelect,
  isLoading = false
}: SelectCategoryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("popular");
  const { toast } = useToast();
  
  const popularCategories: CategoryOption[] = [
    { id: "restaurant", label: "Restaurants", icon: <Utensils className="h-4 w-4" /> },
    { id: "cafe", label: "Cafes", icon: <Coffee className="h-4 w-4" /> },
    { id: "school", label: "Schools", icon: <School className="h-4 w-4" /> },
    { id: "supermarket", label: "Supermarkets", icon: <ShoppingCart className="h-4 w-4" /> },
    { id: "hospital", label: "Hospitals", icon: <Stethoscope className="h-4 w-4" /> },
    { id: "park", label: "Parks", icon: <Park className="h-4 w-4" /> }
  ];
  
  const moreCategories: CategoryOption[] = [
    { id: "bank", label: "Banks", icon: <Bank className="h-4 w-4" /> },
    { id: "shopping_mall", label: "Shopping Malls", icon: <ShoppingCart className="h-4 w-4" /> },
    { id: "library", label: "Libraries", icon: <Building2 className="h-4 w-4" /> },
    { id: "transit_station", label: "Transit Stations", icon: <Bus className="h-4 w-4" /> },
    { id: "gym", label: "Gyms", icon: <Building className="h-4 w-4" /> },
    { id: "tourist_attraction", label: "Tourist Attractions", icon: <Landmark className="h-4 w-4" /> }
  ];
  
  const handleSelectCategory = useCallback(async (category: string) => {
    console.log("SelectCategoryModal: Selected category:", category);
    setSelectedCategory(category);
    
    // Start API request
    console.log(`SelectCategoryModal: Starting API request for category: ${category}`);
    
    try {
      const result = await onSelect(category);
      console.log(`SelectCategoryModal: API request completed for ${category}:`, result);
      
      if (!result) {
        console.log(`SelectCategoryModal: No results returned for category: ${category}`);
        // The toast will be handled by the parent component
      } else {
        onClose();
      }
    } catch (error) {
      console.error(`SelectCategoryModal: Error fetching ${category}:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${category} places`,
        variant: "destructive"
      });
    } finally {
      setSelectedCategory(null);
    }
  }, [onSelect, onClose, toast]);
  
  const categories = activeTab === "popular" ? popularCategories : moreCategories;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find Nearby Places</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="more">More</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className={`flex items-center justify-start gap-2 h-auto py-3 ${
                  selectedCategory === category.id ? 'border-primary' : ''
                }`}
                onClick={() => handleSelectCategory(category.id)}
                disabled={isLoading || selectedCategory !== null}
              >
                {category.icon}
                <span>{category.label}</span>
                {selectedCategory === category.id && (
                  <span className="ml-auto text-xs animate-pulse">Loading...</span>
                )}
              </Button>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
