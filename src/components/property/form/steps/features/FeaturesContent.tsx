
import React from 'react';
import { PropertyFormData, PropertyFeature } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface FeaturesContentProps {
  formData: PropertyFormData;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
}

export function FeaturesContent({
  formData,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature
}: FeaturesContentProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Property Features</CardTitle>
          <Button size="sm" variant="outline" onClick={onAddFeature}>
            <Plus className="h-4 w-4 mr-1" /> Add Feature
          </Button>
        </CardHeader>
        <CardContent>
          {formData.features && formData.features.length > 0 ? (
            <div className="space-y-3">
              {formData.features.map((feature: PropertyFeature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Input
                    value={feature.description}
                    onChange={(e) => onUpdateFeature(feature.id, e.target.value)}
                    placeholder="Enter feature description"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFeature(feature.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No features added yet. Click the 'Add Feature' button to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
