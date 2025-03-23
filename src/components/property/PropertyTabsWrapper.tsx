
import { PropertyTabs } from "./PropertyTabs";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";
import { PropertyData } from "@/types/property";
import { usePropertyTabs } from "@/hooks/usePropertyTabs";
import { PropertyFormManager } from "./tabs/wrapper/PropertyFormManager";
import { PropertyTabActionsHandler } from "./tabs/wrapper/PropertyTabActionsHandler";
import { PropertyWebViewDialog } from "./tabs/wrapper/PropertyWebViewDialog";
import { Tabs } from "@/components/ui/tabs";
import { useWebViewOpenState } from "@/hooks/useWebViewOpenState";
import React, { Suspense, lazy, useState, useEffect, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";

// Using lazy loading for all tab content components to reduce initial load time
const LazyPropertyContentTab = lazy(() => 
  import("./tabs/PropertyContentTab").then(module => ({ default: module.PropertyContentTab }))
);

interface PropertyTabsWrapperProps {
  property: PropertyData;
  settings: any;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  agentInfo?: { id: string; name: string } | null;
  isArchived?: boolean;
}

export function PropertyTabsWrapper({
  property,
  settings,
  onSave,
  onDelete,
  agentInfo,
  isArchived = false
}: PropertyTabsWrapperProps) {
  const { activeTab, setActiveTab } = usePropertyTabs();
  const { isWebViewOpen, setIsWebViewOpen } = useWebViewOpenState();
  const [isTabLoading, setIsTabLoading] = useState(false);
  
  // Track tab changes to show loading state
  useEffect(() => {
    setIsTabLoading(true);
    // Use a short timeout to allow React to process tab change
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 300); // Slightly longer timeout to ensure components are ready
    
    return () => clearTimeout(timer);
  }, [activeTab]);
  
  // Add a stub function for handleSaveTemplate
  const handleSaveTemplate = async (templateId: string) => {
    console.log("Template functionality has been removed");
    return Promise.resolve();
  };
  
  // Create an adapter function that doesn't require the event parameter
  const handleOpenWebView = () => {
    setIsWebViewOpen(true);
  };

  // Render loading spinner for tab content
  const renderTabLoader = () => (
    <div className="flex justify-center items-center py-12">
      <Spinner className="h-8 w-8 text-primary" />
      <span className="ml-3">Loading tab content...</span>
    </div>
  );

  // Memoize the tab navigation to prevent rerenders
  const tabsElement = useMemo(() => (
    <Tabs 
      defaultValue={activeTab} 
      value={activeTab} 
      onValueChange={setActiveTab}
    >
      <PropertyTabs 
        activeTab={activeTab} 
        handleTabChange={setActiveTab}
        propertyId={property.id}
      >
        <Suspense fallback={renderTabLoader()}>
          {!isTabLoading ? (
            <PropertyTabActionsHandler 
              propertyId={property.id} 
              propertyData={property} 
              settings={settings}
              isArchived={isArchived}
            >
              {({ webViewOpen, setWebViewOpen, handleGeneratePDF, handleOpenWebView }) => (
                <PropertyFormManager property={property} isArchived={isArchived}>
                  {(formManagerProps) => (
                    <PropertyTabContents
                      activeTab={activeTab}
                      property={formManagerProps.propertyWithRequiredProps}
                      formState={formManagerProps.formState}
                      agentInfo={agentInfo}
                      isUpdating={false}
                      onSave={onSave}
                      onDelete={onDelete}
                      handleSaveTemplate={handleSaveTemplate}
                      handleGeneratePDF={handleGeneratePDF}
                      handleWebView={handleOpenWebView}
                      isArchived={isArchived}
                      {...formManagerProps}
                    />
                  )}
                </PropertyFormManager>
              )}
            </PropertyTabActionsHandler>
          ) : (
            renderTabLoader()
          )}
        </Suspense>
      </PropertyTabs>
    </Tabs>
  ), [activeTab, property, settings, isArchived, agentInfo, onSave, onDelete, setActiveTab, isTabLoading]);

  return (
    <div className="space-y-6">
      {tabsElement}
      
      {/* WebView Dialog */}
      <PropertyWebViewDialog
        propertyData={property}
        isOpen={isWebViewOpen}
        onOpenChange={setIsWebViewOpen}
      />
    </div>
  );
}
