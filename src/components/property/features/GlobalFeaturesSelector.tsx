
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PropertyFeature } from "@/types/property";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface GlobalFeaturesSelectorProps {
  globalFeatures: PropertyFeature[];
  propertyFeatures: PropertyFeature[];
  onSelect: (feature: PropertyFeature) => void;
  onDeselect: (id: string) => void;
}

export function GlobalFeaturesSelector({
  globalFeatures,
  propertyFeatures,
  onSelect,
  onDeselect
}: GlobalFeaturesSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter features based on search query
  const filteredFeatures = globalFeatures.filter(feature => 
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check if a feature is already selected for this property
  const isFeatureSelected = (featureId: string) => {
    return propertyFeatures.some(f => f.id === featureId);
  };
  
  // Find a property feature by its description (for cases where IDs don't match)
  const findPropertyFeatureByDescription = (description: string) => {
    return propertyFeatures.find(f => 
      f.description.toLowerCase() === description.toLowerCase()
    );
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (feature: PropertyFeature, checked: boolean) => {
    if (checked) {
      // Check if we already have a feature with the same description
      const existingFeature = findPropertyFeatureByDescription(feature.description);
      if (existingFeature) {
        // Already selected, do nothing
        return;
      }
      onSelect(feature);
    } else {
      // If the feature exists in propertyFeatures, we need to find its ID
      const existingFeature = findPropertyFeatureByDescription(feature.description);
      if (existingFeature) {
        onDeselect(existingFeature.id);
      } else if (isFeatureSelected(feature.id)) {
        // If the IDs match directly
        onDeselect(feature.id);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {filteredFeatures.length === 0 ? (
        <p className="text-sm text-muted-foreground italic py-2">
          {globalFeatures.length === 0 
            ? "No global features available. Add features in Global Settings."
            : "No features matching your search."}
        </p>
      ) : (
        <ScrollArea className="h-80 border rounded-md p-4">
          <div className="space-y-2">
            {filteredFeatures.map((feature) => {
              // Check if this feature is already in the property features list
              const isSelected = isFeatureSelected(feature.id) || 
                propertyFeatures.some(f => f.description.toLowerCase() === feature.description.toLowerCase());
              
              return (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`feature-${feature.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleCheckboxChange(feature, checked === true)}
                  />
                  <Label htmlFor={`feature-${feature.id}`} className="cursor-pointer">
                    {feature.description}
                  </Label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
      
      <p className="text-sm text-muted-foreground">
        Select features to add to this property. Global features can be managed in the Settings.
      </p>
    </div>
  );
}
