
import React, { useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralInfoContent } from '../../form/steps/general-info/GeneralInfoContent';
import { LocationContent } from '../../form/steps/location/LocationContent';
import { FeaturesContent } from '../../form/steps/features/FeaturesContent';
import { AreasContent } from '../../form/steps/areas/AreasContent';

interface ContentTabWrapperProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  currentStep?: number;
  handleStepClick?: (step: number) => void;
  setPendingChanges?: (pending: boolean) => void;
  onSubmit?: () => void;
}

export function ContentTabWrapper({
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  onFetchLocationData,
  onGenerateLocationDescription,
  onGenerateMap,
  isLoadingLocationData,
  isGeneratingMap,
  currentStep = 0,
  handleStepClick,
  setPendingChanges,
  onSubmit
}: ContentTabWrapperProps) {
  const [activeTab, setActiveTab] = useState('general');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
    if (handleStepClick) {
      switch (value) {
        case 'general':
          handleStepClick(0);
          break;
        case 'location':
          handleStepClick(1);
          break;
        case 'features':
          handleStepClick(2);
          break;
        case 'areas':
          handleStepClick(3);
          break;
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralInfoContent 
            formData={formData} 
            onFieldChange={onFieldChange} 
          />
        </TabsContent>

        <TabsContent value="location">
          <LocationContent 
            formData={formData} 
            onFieldChange={onFieldChange}
            onFetchLocationData={onFetchLocationData}
            onGenerateLocationDescription={onGenerateLocationDescription}
            onGenerateMap={onGenerateMap}
            isLoadingLocationData={isLoadingLocationData}
            isGeneratingMap={isGeneratingMap}
          />
        </TabsContent>

        <TabsContent value="features">
          <FeaturesContent
            formData={formData}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
          />
        </TabsContent>

        <TabsContent value="areas">
          <AreasContent
            formData={formData}
            onAddArea={onAddArea}
            onRemoveArea={onRemoveArea}
            onUpdateArea={onUpdateArea}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImagesSelect={onAreaImagesSelect}
            onAreaImageUpload={onAreaImageUpload}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
