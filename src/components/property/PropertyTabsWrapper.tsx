import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyData, PropertyFormData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Users } from "lucide-react";

interface PropertyTabsWrapperProps {
  property: PropertyData;
  formData?: PropertyFormData;
  settings: AgencySettings;
  onSave: () => void;
  onDelete: () => Promise<void>;
  isArchived?: boolean;
  agentInfo?: { id: string; name: string } | null;
  children?: React.ReactNode;
  initialTab?: string;
  initialContentStep?: number;
  handlers?: any;
  [key: string]: any;
}

export function PropertyTabsWrapper({
  property,
  formData,
  settings,
  onSave,
  onDelete,
  isArchived = false,
  agentInfo,
  children,
  initialTab,
  initialContentStep,
  handlers = {},
  ...props
}: PropertyTabsWrapperProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const urlTab = searchParams.get("propertyTab");
  const startTab = initialTab || urlTab || "dashboard";
  
  const [activeTab, setActiveTab] = useState(startTab);
  const [contentStep, setContentStep] = useState(initialContentStep || 0);
  
  useEffect(() => {
    console.log("PropertyTabsWrapper - Active Tab changed to:", activeTab);
    
    if (activeTab === "content" && id) {
      const slugs = ["general", "location", "features", "areas"];
      const slug = slugs[contentStep] || "general";
      
      navigate(`/property/${id}/content/${slug}`);
    } else if (id) {
      if (activeTab !== "dashboard") {
        navigate(`/property/${id}/${activeTab}`);
      } else {
        navigate(`/property/${id}/dashboard`);
      }
    } else {
      searchParams.set("propertyTab", activeTab);
      setSearchParams(searchParams);
    }
  }, [activeTab, id, navigate, searchParams, setSearchParams, contentStep]);

  useEffect(() => {
    if (initialContentStep !== undefined && initialContentStep !== contentStep) {
      console.log("PropertyTabsWrapper - Setting content step to:", initialContentStep);
      setContentStep(initialContentStep);
    }
  }, [initialContentStep, contentStep]);

  useEffect(() => {
    console.log("PropertyTabsWrapper - Active Tab:", activeTab);
    console.log("PropertyTabsWrapper - Content Step:", contentStep);
    console.log("PropertyTabsWrapper - Property ID:", property.id);
    console.log("PropertyTabsWrapper - Initial tab prop:", initialTab);
    console.log("PropertyTabsWrapper - Initial content step prop:", initialContentStep);
    console.log("PropertyTabsWrapper - Has formData:", !!formData);
  }, [activeTab, property.id, initialTab, initialContentStep, contentStep, formData]);

  const handleTabChange = (value: string) => {
    console.log("PropertyTabsWrapper - Tab change requested to:", value);
    setActiveTab(value);
  };
  
  const handleStepClick = (step: number) => {
    console.log("PropertyTabsWrapper - Content step change requested to:", step);
    setContentStep(step);
  };

  const combinedHandlers = {
    ...handlers,
    currentStep: contentStep,
    handleStepClick: handleStepClick
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 h-auto">
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
        <TabsTrigger
          value="participants"
          disabled={isArchived}
          className="py-3 text-sm flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          <span>Participants</span>
        </TabsTrigger>
      </TabsList>

      <PropertyTabContents
        activeTab={activeTab}
        property={property}
        formData={formData || property}
        handlers={combinedHandlers}
        onSave={onSave}
        onDelete={onDelete}
        handleSaveObjectId={props.handleSaveObjectId}
        handleSaveAgent={props.handleSaveAgent}
        handleGeneratePDF={props.handleGeneratePDF || ((e: React.MouseEvent) => {
          console.log("Default handleGeneratePDF called");
        })}
        handleWebView={props.handleWebView || ((e: React.MouseEvent) => {
          console.log("Default handleWebView called");
        })}
        isUpdating={props.isUpdating || false}
        agentInfo={agentInfo}
      />
    </Tabs>
  );
}
