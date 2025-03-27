
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";
import { useSearchParams } from "react-router-dom";

interface PropertyTabsWrapperProps {
  property: PropertyData;
  settings: AgencySettings;
  onSave: () => void;
  onDelete: () => Promise<void>;
  isArchived?: boolean;
  agentInfo?: { id: string; name: string } | null;
  children?: React.ReactNode;
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
  ...props
}: PropertyTabsWrapperProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("propertyTab") || "dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update URL when tab changes
  useEffect(() => {
    searchParams.set("propertyTab", activeTab);
    setSearchParams(searchParams);
  }, [activeTab]);

  // Log the current tab for debugging
  useEffect(() => {
    console.log("PropertyTabsWrapper - Active Tab:", activeTab);
    console.log("PropertyTabsWrapper - Property ID:", property.id);
  }, [activeTab, property.id]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
        formData={props.formData}
        handlers={props.handlers}
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
