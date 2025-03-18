
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyTabSelector } from '@/components/property/tabs/PropertyTabSelector';
import { PropertyFormManager } from '@/components/property/tabs/wrapper/PropertyFormManager';
import { initialFormData } from '@/hooks/property-form/initialFormData';
import { PropertyData } from '@/types/property';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { usePropertyTabs } from '@/hooks/usePropertyTabs';
import { PropertyTabContents } from '@/components/property/tabs/wrapper/PropertyTabContents';

export function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeTab, setActiveTab } = usePropertyTabs();
  
  // Create an empty property data structure with required fields for PropertyData
  const emptyProperty: PropertyData = {
    ...initialFormData,
    id: id || '',
    title: '',
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    livingArea: '',
    buildYear: '',
    garages: '',
    energyLabel: '',
    hasGarden: false,
    description: '',
    location_description: ''
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Navigate to the correct route
    if (id) {
      navigate(`/property/${id}/${tab}`);
    }
  };

  // Sync with URL path on mount
  useEffect(() => {
    if (id && activeTab) {
      navigate(`/property/${id}/${activeTab}`);
    }
  }, [id]);

  // Create a wrapper that returns a Promise for functions that don't
  const asyncWrapper = (fn: Function) => async (...args: any[]) => {
    fn(...args);
    return Promise.resolve();
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">
          Property: {emptyProperty.title || 'Untitled Property'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PropertyTabSelector
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <div className="mt-4">
          <PropertyFormManager property={emptyProperty}>
            {(formProps) => (
              <div className="mt-4">
                <PropertyTabContents
                  activeTab={activeTab}
                  property={emptyProperty}
                  formState={formProps.formState}
                  agentInfo={{ id: '', name: '' }}
                  templateInfo={{ id: 'default', name: 'Default Template' }}
                  isUpdating={false}
                  onDelete={() => Promise.resolve()}
                  onFieldChange={formProps.handleFieldChange}
                  onAddFeature={formProps.addFeature}
                  onRemoveFeature={formProps.removeFeature}
                  onUpdateFeature={formProps.updateFeature}
                  onAddArea={formProps.addArea}
                  onRemoveArea={formProps.removeArea}
                  onUpdateArea={formProps.updateArea}
                  onAreaImageRemove={formProps.handleAreaImageRemove}
                  onAreaImagesSelect={formProps.handleAreaImagesSelect}
                  onAreaImageUpload={formProps.handleAreaImageUpload}
                  handleImageUpload={asyncWrapper(formProps.handleImageUpload)}
                  handleRemoveImage={formProps.handleRemoveImage}
                  isUploading={formProps.isUploading}
                  handleAreaPhotosUpload={formProps.handleAreaPhotosUpload || (async () => Promise.resolve())}
                  handleRemoveAreaPhoto={formProps.handleRemoveAreaPhoto}
                  handleFloorplanUpload={asyncWrapper(formProps.handleFloorplanUpload)}
                  handleRemoveFloorplan={formProps.handleRemoveFloorplan}
                  isUploadingFloorplan={formProps.isUploadingFloorplan || false}
                  handleSetFeaturedImage={formProps.handleSetFeaturedImage}
                  handleToggleFeaturedImage={formProps.handleToggleFeaturedImage}
                  handleVirtualTourUpdate={formProps.handleVirtualTourUpdate}
                  handleYoutubeUrlUpdate={formProps.handleYoutubeUrlUpdate}
                  handleFloorplanEmbedScriptUpdate={formProps.handleFloorplanEmbedScriptUpdate}
                  currentStep={formProps.currentStep || 0}
                  handleStepClick={formProps.handleStepClick || (() => {})}
                  onSubmit={() => console.log("Form submitted")}
                />
              </div>
            )}
          </PropertyFormManager>
        </div>
      </CardContent>
    </Card>
  );
}
