
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

interface PropertyTabsWrapperProps {
  property: PropertyData;
  settings: AgencySettings;
  onSave: () => void;
  onDelete: () => Promise<void>;
  isArchived?: boolean;
  agentInfo?: { id: string; name: string } | null;
  children?: React.ReactNode;
  initialTab?: string;
  initialContentStep?: number;
  [key: string]: any;
}

export function PropertyTabsWrapper({
  property,
  settings,
  onSave,
  onDelete,
  isArchived = false,
  agentInfo,
  children,
  initialTab,
  initialContentStep,
  ...props
}: PropertyTabsWrapperProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Determine initial tab with priority:
  // 1. initialTab prop (from URL or parent component)
  // 2. searchParams.propertyTab
  // 3. default to "dashboard"
  const urlTab = searchParams.get("propertyTab");
  const startTab = initialTab || urlTab || "dashboard";
  
  const [activeTab, setActiveTab] = useState(startTab);
  const [contentStep, setContentStep] = useState(initialContentStep || 0);
  
  // Update URL when tab changes
  useEffect(() => {
    console.log("PropertyTabsWrapper - Active Tab changed to:", activeTab);
    
    // For content tab, ensure we preserve the step in URL
    if (activeTab === "content" && id) {
      // Map content steps to slugs
      const slugs = ["general", "location", "features", "areas"];
      const slug = slugs[contentStep] || "general";
      
      // Navigate to the content step URL
      navigate(`/property/${id}/content/${slug}`);
    } else if (id) {
      // For other tabs, navigate to the tab
      if (activeTab !== "dashboard") {
        navigate(`/property/${id}/${activeTab}`);
      } else {
        navigate(`/property/${id}/dashboard`);
      }
    } else {
      // Fallback to using search params if no ID (should be rare)
      searchParams.set("propertyTab", activeTab);
      setSearchParams(searchParams);
    }
  }, [activeTab, id, navigate, searchParams, setSearchParams, contentStep]);

  // Effect to sync contentStep with initialContentStep when it changes
  useEffect(() => {
    if (initialContentStep !== undefined && initialContentStep !== contentStep) {
      console.log("PropertyTabsWrapper - Setting content step to:", initialContentStep);
      setContentStep(initialContentStep);
    }
  }, [initialContentStep, contentStep]);

  // Log the current tab for debugging
  useEffect(() => {
    console.log("PropertyTabsWrapper - Active Tab:", activeTab);
    console.log("PropertyTabsWrapper - Content Step:", contentStep);
    console.log("PropertyTabsWrapper - Property ID:", property.id);
    console.log("PropertyTabsWrapper - Initial tab prop:", initialTab);
    console.log("PropertyTabsWrapper - Initial content step prop:", initialContentStep);
  }, [activeTab, property.id, initialTab, initialContentStep, contentStep]);

  const handleTabChange = (value: string) => {
    console.log("PropertyTabsWrapper - Tab change requested to:", value);
    setActiveTab(value);
  };
  
  const handleStepClick = (step: number) => {
    console.log("PropertyTabsWrapper - Content step change requested to:", step);
    setContentStep(step);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 h-auto">
        <TabsTrigger
          value="dashboard"
          disabled={isArchived}
          className="py-3 text-sm"
        >
          Dashboard
        </TabsTrigger>
        <TabsTrigger
          value="content"
          disabled={isArchived}
          className="py-3 text-sm"
        >
          Content
        </TabsTrigger>
        <TabsTrigger
          value="media"
          disabled={isArchived}
          className="py-3 text-sm"
        >
          Media
        </TabsTrigger>
        <TabsTrigger
          value="communications"
          disabled={isArchived}
          className="py-3 text-sm"
        >
          Communications
        </TabsTrigger>
      </TabsList>

      <PropertyTabContents
        activeTab={activeTab}
        property={property}
        formData={props.formData || property}
        handlers={{
          ...props.handlers,
          currentStep: contentStep,
          handleStepClick: handleStepClick
        }}
        onSave={onSave}
        onDelete={onDelete}
        handleSaveObjectId={props.handleSaveObjectId}
        handleSaveAgent={props.handleSaveAgent}
        handleGeneratePDF={props.handleGeneratePDF || (() => {})}
        handleWebView={props.handleWebView || (() => {})}
        isUpdating={props.isUpdating || false}
        agentInfo={agentInfo}
      />
    </Tabs>
  );
}
