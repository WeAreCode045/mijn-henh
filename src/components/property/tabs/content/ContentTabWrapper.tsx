
import { PropertyData, PropertyFormData } from "@/types/property";
import { GeneralInfoContent } from "@/components/property/form/steps/general-info/GeneralInfoContent";
import { LocationContent } from "@/components/property/form/steps/location/LocationContent";
import { FeaturesContent } from "@/components/property/form/steps/features/FeaturesContent";
import { AreasContent } from "@/components/property/form/steps/areas/AreasContent";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ContentTabWrapperProps {
  property?: PropertyData;
  formData: PropertyFormData;
  handlers?: any; // For passing handlers as a group
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, images: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  currentStep: number;
  handleStepClick: (step: number) => void;
  setPendingChanges?: (pending: boolean) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  onSubmit: () => void;
}

export function ContentTabWrapper(props: ContentTabWrapperProps) {
  // Allow props to be passed either directly or via handlers
  const handlers = props.handlers || {};
  
  const {
    property,
    formData,
    onFieldChange = handlers.onFieldChange,
    onAddFeature = handlers.onAddFeature,
    onRemoveFeature = handlers.onRemoveFeature, 
    onUpdateFeature = handlers.onUpdateFeature,
    onAddArea = handlers.onAddArea,
    onRemoveArea = handlers.onRemoveArea,
    onUpdateArea = handlers.onUpdateArea,
    onAreaImageRemove = handlers.onAreaImageRemove,
    onAreaImagesSelect = handlers.onAreaImagesSelect,
    onAreaImageUpload = handlers.onAreaImageUpload,
    currentStep = handlers.currentStep || 0,
    handleStepClick = handlers.handleStepClick || (() => {}),
    setPendingChanges = handlers.setPendingChanges,
    onFetchLocationData = handlers.onFetchLocationData || (() => Promise.resolve()),
    onFetchCategoryPlaces = handlers.onFetchCategoryPlaces || (() => Promise.resolve({})),
    onFetchNearbyCities = handlers.onFetchNearbyCities || (() => Promise.resolve({})),
    onGenerateLocationDescription = handlers.onGenerateLocationDescription || (() => Promise.resolve()),
    onGenerateMap = handlers.onGenerateMap || (() => Promise.resolve()),
    onRemoveNearbyPlace = handlers.onRemoveNearbyPlace || (() => {}),
    isLoadingLocationData = handlers.isLoadingLocationData || false,
    isGeneratingMap = handlers.isGeneratingMap || false,
    onSubmit = handlers.onSubmit || (() => {})
  } = props;

  const [activeTab, setActiveTab] = useState<string>(String(currentStep || 0));

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    handleStepClick(Number(tab));
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="0">General Info</TabsTrigger>
          <TabsTrigger value="1">Location</TabsTrigger>
          <TabsTrigger value="2">Features</TabsTrigger>
          <TabsTrigger value="3">Areas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="0" className="space-y-4 pt-4">
          <GeneralInfoContent
            formData={formData}
            onFieldChange={onFieldChange}
          />
        </TabsContent>
        
        <TabsContent value="1" className="space-y-4 pt-4">
          <LocationContent
            formData={formData}
            onFieldChange={onFieldChange}
            onFetchLocationData={onFetchLocationData}
            onFetchCategoryPlaces={onFetchCategoryPlaces}
            onFetchNearbyCities={onFetchNearbyCities}
            onGenerateLocationDescription={onGenerateLocationDescription}
            onGenerateMap={onGenerateMap}
            onRemoveNearbyPlace={onRemoveNearbyPlace}
            isLoadingLocationData={isLoadingLocationData}
            isGeneratingMap={isGeneratingMap}
          />
        </TabsContent>
        
        <TabsContent value="2" className="space-y-4 pt-4">
          <FeaturesContent
            formData={formData}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onUpdateFeature={onUpdateFeature}
          />
        </TabsContent>
        
        <TabsContent value="3" className="space-y-4 pt-4">
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
