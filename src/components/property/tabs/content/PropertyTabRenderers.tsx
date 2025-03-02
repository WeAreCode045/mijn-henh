
import { PropertyContentTab } from "../PropertyContentTab";
import { PropertyDashboardTab } from "../PropertyDashboardTab";
import { PropertyMediaTab } from "../PropertyMediaTab";
import { FloorplansTab } from "../FloorplansTab";
import { MediaTabContent } from "../wrapper/MediaTabContent";

export function renderMediaTab(tabProps: any) {
  if (tabProps.activeTab !== 'media' && tabProps.activeTab !== 'floorplans') return null;

  const activeSubTab = tabProps.activeTab === 'floorplans' ? 'floorplans' : 'media';

  return (
    <MediaTabContent
      id={tabProps.property.id}
      title={tabProps.property.title}
      images={tabProps.formState.images || []}
      featuredImage={tabProps.formState.featuredImage}
      gridImages={tabProps.formState.gridImages || []}
      floorplans={tabProps.formState.floorplans || []}
      floorplanEmbedScript={tabProps.formState.floorplanEmbedScript || ""}
      virtualTourUrl={tabProps.formState.virtualTourUrl}
      youtubeUrl={tabProps.formState.youtubeUrl}
      notes={tabProps.formState.notes}
      onVirtualTourUpdate={(url) => tabProps.handlers.onFieldChange('virtualTourUrl', url)}
      onYoutubeUrlUpdate={(url) => tabProps.handlers.onFieldChange('youtubeUrl', url)}
      onNotesUpdate={(notes) => tabProps.handlers.onFieldChange('notes', notes)}
      onFloorplanEmbedScriptUpdate={(script) => tabProps.handlers.onFieldChange('floorplanEmbedScript', script)}
      onImageUpload={tabProps.handlers.handleImageUpload}
      onRemoveImage={tabProps.handlers.handleRemoveImage}
      onFloorplanUpload={tabProps.handlers.handleFloorplanUpload}
      onRemoveFloorplan={tabProps.handlers.handleRemoveFloorplan}
      onSetFeaturedImage={tabProps.handlers.handleSetFeaturedImage}
      onToggleGridImage={tabProps.handlers.handleToggleGridImage}
      isUploading={tabProps.handlers.isUploading}
      activeSubTab={activeSubTab}
    />
  );
}

// Add other renderers as needed from the original file
export function renderDashboardTab(tabProps: any) {
  // Implementation from original file
}

export function renderContentTab(tabProps: any) {
  // Implementation from original file
}

export function renderCommunicationsTab(tabProps: any) {
  // Implementation from original file
}
