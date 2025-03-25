
import { useState } from "react";
import { PropertyFeature } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useFeatures } from "@/hooks/useFeatures";

interface FeaturesStepProps {
  propertyId: string;
  features: PropertyFeature[];
  onAddFeature: (feature: string) => void;
  onRemoveFeature: (id: string) => void;
}

export function FeaturesStep({
  propertyId,
  features,
  onAddFeature,
  onRemoveFeature,
}: FeaturesStepProps) {
  const [newFeature, setNewFeature] = useState("");
  const [activeTab, setActiveTab] = useState("custom");
  
  const { globalFeatures, addGlobalFeature } = useFeatures(propertyId);
  
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onAddFeature(newFeature);
      setNewFeature("");
    }
  };

  const isGlobalFeatureAdded = (globalFeature: PropertyFeature) => {
    return features.some(feature => feature.id === globalFeature.id);
  };

  const handleGlobalFeatureToggle = (globalFeature: PropertyFeature, isChecked: boolean) => {
    if (isChecked) {
      addGlobalFeature(globalFeature);
    } else {
      onRemoveFeature(globalFeature.id);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="custom" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Features</TabsTrigger>
          <TabsTrigger value="global">Global Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom" className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Property Features</div>
            <div className="text-xs text-muted-foreground mb-2">
              Add features specific to this property.
            </div>
            
            {/* Add new feature */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAddFeature}
                disabled={!newFeature.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          
          {/* Feature list */}
          <div className="space-y-2">
            {features.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">
                No features added yet. Add features to highlight property amenities.
              </div>
            ) : (
              features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span className="text-sm">{feature.description}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveFeature(feature.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="global" className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Global Features</div>
            <div className="text-xs text-muted-foreground mb-2">
              Select from globally defined features to add to this property.
            </div>
            
            {/* Global features list with checkboxes */}
            <div className="space-y-2">
              {globalFeatures.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  No global features available. Add them in Settings &gt; Global.
                </div>
              ) : (
                globalFeatures.map((globalFeature) => (
                  <div
                    key={globalFeature.id}
                    className="flex items-center gap-2 p-2 border rounded-md"
                  >
                    <Checkbox
                      id={`global-feature-${globalFeature.id}`}
                      checked={isGlobalFeatureAdded(globalFeature)}
                      onCheckedChange={(checked) => 
                        handleGlobalFeatureToggle(globalFeature, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`global-feature-${globalFeature.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {globalFeature.description}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
