
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { Button } from "@/components/ui/button";
import { AgentSelector } from "@/components/property/AgentSelector";
import { PropertyImageUpload } from "@/components/property/PropertyImageUpload";
import { Trash } from "lucide-react";

interface PropertyActionsPanelProps {
  propertyData: PropertyData;
  agencySettings: AgencySettings;
  isAdmin: boolean;
  agents: any[];
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
  onDeleteProperty: () => Promise<void>;
  onSaveProperty: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  images: string[];
}

export function PropertyActionsPanel({
  propertyData,
  agencySettings,
  isAdmin,
  agents,
  selectedAgent,
  onAgentSelect,
  onDeleteProperty,
  onSaveProperty,
  onImageUpload,
  onRemoveImage,
  images
}: PropertyActionsPanelProps) {
  return (
    <div className="w-full lg:w-96 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={onSaveProperty}
            disabled={!propertyData.title}
          >
            Save Property
          </Button>
          
          {isAdmin && (
            <AgentSelector
              agents={agents}
              selectedAgent={selectedAgent}
              onAgentSelect={onAgentSelect}
            />
          )}

          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={onDeleteProperty}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Property
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyImageUpload
            images={images}
            onUpload={onImageUpload}
            onRemove={onRemoveImage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
