
import React, { useState } from "react";
import { PropertyArea } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaImagesUpload } from "./AreaImagesUpload";

interface AreaEditorProps {
  area: PropertyArea;
  onUpdate: (field: string, value: any) => void;
  onAreaImageRemove?: (imageId: string) => void;
  onAreaImageUpload?: (files: FileList) => Promise<void>;
  isUploading?: boolean;
}

export function AreaEditor({
  area,
  onUpdate,
  onAreaImageRemove,
  onAreaImageUpload,
  isUploading = false
}: AreaEditorProps) {
  const [activeTab, setActiveTab] = useState("details");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate(name, value);
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor={`area-name-${area.id}`}>Name</Label>
            <Input
              id={`area-name-${area.id}`}
              name="name"
              value={area.name || ''}
              onChange={handleInputChange}
              placeholder="Area name (e.g. Living Room, Kitchen)"
            />
          </div>
          
          <div>
            <Label htmlFor={`area-description-${area.id}`}>Description</Label>
            <Textarea
              id={`area-description-${area.id}`}
              name="description"
              value={area.description || ''}
              onChange={handleInputChange}
              placeholder="Describe this area..."
              rows={5}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="images">
          <AreaImagesUpload
            areaId={area.id}
            images={area.images || []}
            onRemove={onAreaImageRemove}
            onUpload={onAreaImageUpload}
            isUploading={isUploading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
