
import React from 'react';
import { TabContentRenderProps } from '../wrapper/types/PropertyTabTypes';
import { DashboardTabContent } from './DashboardTabContent';
import { ContentTabContent } from './ContentTabContent';
import { MediaTabContent } from './MediaTabContent';
import { LocationTabContent } from './LocationTabContent';
import { SettingsTabContent } from './SettingsTabContent';
import { Button } from '@/components/ui/button';
import { Unlock } from 'lucide-react';

export class TabContentRenderers {
  static renderTabContent(props: TabContentRenderProps) {
    const { activeTab, isArchived, handlers } = props;
    
    // Show archive notice for tabs that should be restricted
    if (isArchived && (activeTab === 'content' || activeTab === 'media' || activeTab === 'location')) {
      return (
        <div className="p-8 border border-amber-200 rounded-lg bg-amber-50 text-amber-800">
          <div className="flex flex-col items-center gap-4 text-center">
            <Unlock className="h-12 w-12 text-amber-500" />
            <h3 className="text-2xl font-semibold">This property is archived</h3>
            <p className="text-lg max-w-md">
              Editing is disabled while the property is archived. You can still view the data, but must unarchive the property to make changes.
            </p>
            <p className="text-sm opacity-75 mt-4">
              Go to the Dashboard tab to unarchive this property
            </p>
          </div>
        </div>
      );
    }

    // Render appropriate tab content based on active tab
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTabContent
            property={props.property}
            onDelete={handlers.onDelete}
            onSave={handlers.onSave}
            onWebView={handlers.handleWebView}
            handleSaveAgent={handlers.handleSaveAgent}
          />
        );
      case 'content':
        // For archived properties, pass isReadOnly=true to the content tab
        return (
          <ContentTabContent
            property={props.property}
            formState={props.formState}
            onFieldChange={handlers.onFieldChange}
            onAddFeature={handlers.onAddFeature}
            onRemoveFeature={(index) => handlers.onRemoveFeature(index)}
            onUpdateFeature={(index, value) => handlers.onUpdateFeature(index, value)}
            currentStep={handlers.currentStep}
            handleStepClick={handlers.handleStepClick}
            onSubmit={() => handlers.setPendingChanges(true)}
            isReadOnly={isArchived}
          />
        );
      case 'media':
        // For archived properties, pass isReadOnly=true to the media tab
        return (
          <MediaTabContent
            property={props.property}
            formState={props.formState}
            onFieldChange={handlers.onFieldChange}
            handleVirtualTourUpdate={handlers.handleVirtualTourUpdate}
            handleYoutubeUrlUpdate={handlers.handleYoutubeUrlUpdate}
            handleFloorplanEmbedScriptUpdate={handlers.handleFloorplanEmbedScriptUpdate}
            isReadOnly={isArchived}
          />
        );
      case 'location':
        // For archived properties, pass isReadOnly=true to the location tab
        return (
          <LocationTabContent
            property={props.property}
            formState={props.formState}
            onFieldChange={handlers.onFieldChange}
            onAddArea={handlers.onAddArea}
            onRemoveArea={handlers.onRemoveArea}
            onUpdateArea={handlers.onUpdateArea}
            onAreaImageRemove={handlers.onAreaImageRemove}
            onAreaImagesSelect={handlers.onAreaImagesSelect}
            onAreaImageUpload={handlers.handleAreaImageUpload}
            onFetchLocationData={handlers.onFetchLocationData}
            onFetchCategoryPlaces={handlers.onFetchCategoryPlaces}
            onFetchNearbyCities={handlers.onFetchNearbyCities}
            onGenerateLocationDescription={handlers.onGenerateLocationDescription}
            onGenerateMap={handlers.onGenerateMap}
            onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
            isLoadingLocationData={handlers.isLoadingLocationData}
            isGeneratingMap={handlers.isGeneratingMap}
            isReadOnly={isArchived}
          />
        );
      case 'settings':
        return (
          <SettingsTabContent
            property={props.property}
            agentInfo={props.agentInfo}
            onDelete={handlers.onDelete}
            onSave={handlers.onSave}
            handleSaveObjectId={handlers.handleSaveObjectId}
            handleSaveAgent={handlers.handleSaveAgent}
            handleSaveTemplate={handlers.handleSaveTemplate}
            isUpdating={props.isUpdating}
            isReadOnly={isArchived}
          />
        );
      default:
        return (
          <div className="p-4">Select a tab to view property details</div>
        );
    }
  }
}
