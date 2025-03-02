
import { PropertyContentTab } from "../PropertyContentTab";
import { PropertyDashboardTab } from "../PropertyDashboardTab";
import { PropertyMediaTab } from "../PropertyMediaTab";
import { FloorplansTab } from "../FloorplansTab";
import { MediaTabContent } from "../wrapper/MediaTabContent";

export function renderMediaTab(tabProps: any) {
  if (tabProps.activeTab !== 'media') return null;

  return (
    <MediaTabContent
      id={tabProps.property.id}
      title={tabProps.property.title}
      images={tabProps.formState.images || []}
      virtualTourUrl={tabProps.formState.virtualTourUrl}
      youtubeUrl={tabProps.formState.youtubeUrl}
      notes={tabProps.formState.notes}
      onVirtualTourUpdate={(url) => tabProps.handlers.onFieldChange('virtualTourUrl', url)}
      onYoutubeUrlUpdate={(url) => tabProps.handlers.onFieldChange('youtubeUrl', url)}
      onNotesUpdate={(notes) => tabProps.handlers.onFieldChange('notes', notes)}
      onImageUpload={tabProps.handlers.handleImageUpload}
      onRemoveImage={tabProps.handlers.handleRemoveImage}
      isUploading={tabProps.handlers.isUploading}
    />
  );
}

// Add other renderers as needed from the original file
export function renderDashboardTab(tabProps: any) {
  // Implementation from original file
  if (tabProps.activeTab !== 'dashboard') return null;
  return null; // Placeholder
}

export function renderContentTab(tabProps: any) {
  // Implementation from original file
  if (tabProps.activeTab !== 'content') return null;
  return null; // Placeholder
}

export function renderFloorplansTab(tabProps: any) {
  if (tabProps.activeTab !== 'floorplans') return null;
  
  return (
    <FloorplansTab
      id={tabProps.property.id}
      floorplans={tabProps.formState?.floorplans || []}
      floorplanEmbedScript={tabProps.formState?.floorplanEmbedScript}
      onFloorplanUpload={tabProps.handlers.handleFloorplanUpload}
      onRemoveFloorplan={tabProps.handlers.handleRemoveFloorplan}
      onFloorplanEmbedScriptUpdate={(script) => tabProps.handlers.onFieldChange('floorplanEmbedScript', script)}
      isUploading={tabProps.handlers.isUploading}
    />
  );
}

export function renderCommunicationsTab(tabProps: any) {
  // Implementation from original file
  if (tabProps.activeTab !== 'communications') return null;
  return null; // Placeholder
}
