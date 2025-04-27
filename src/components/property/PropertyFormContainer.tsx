
import { PropertyTabs } from "./PropertyTabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PropertyFormContent } from "./form/PropertyFormContent";
import { PropertyFormLoader } from "./form/PropertyFormLoader";
import { usePropertyFormContainerData } from "@/hooks/property-form/usePropertyFormContainerData";
import { usePropertyFormContainerActions } from "@/hooks/property-form/usePropertyFormContainerActions";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { PropertyDashboardTab } from "./tabs/dashboard";
import { ParticipantsTab } from "@/pages/property/tabs/ParticipantsTab";
import { DocumentsTab } from "@/pages/property/tabs/DocumentsTab";
import { CommunicationsTab } from "@/pages/property/tabs/CommunicationsTab";
import { DashboardTabContent } from "./tabs/content/DashboardTabContent";

interface PropertyAgentDetailProps {
  agent: { id: string; name: string } | null;
  agents: any[];
  onChange: (agentId: string) => void;
  agentId?: string;
}

// This is a stub component that should be imported from the correct path
// or implemented if it doesn't exist yet
const PropertyAgentDetail = ({ agent, agents, onChange, agentId }: PropertyAgentDetailProps) => {
  return (
    <div className="flex items-center gap-2">
      {agent ? (
        <div>{agent.name}</div>
      ) : (
        <div>No agent assigned</div>
      )}
    </div>
  );
};

interface PropertyFormContainerProps {
  propertyId?: string | null;
  initialTab?: string;
  initialContentStep?: number;
}

export function PropertyFormContainer({ propertyId, initialTab, initialContentStep }: PropertyFormContainerProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab || "dashboard");
  const [agentInfo, setAgentInfo] = useState<{ id: string; name: string } | null>(null);
  const {
    id,
    formData,
    setFormData,
    isLoading,
    settings,
    agents,
    selectedAgent,
    setSelectedAgent,
    isSubmitting,
    setIsSubmitting,
    toast
  } = usePropertyFormContainerData(propertyId);

  const {
    deleteProperty,
    saveProperty,
    handleAgentChange,
    handleImageUpload,
    handleRemoveImage,
    images
  } = usePropertyFormContainerActions(
    formData,
    setFormData,
    setIsSubmitting,
    setSelectedAgent,
    setAgentInfo,
    toast,
    agents
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleSaveAgent = async (agentId: string): Promise<void> => {
    return handleAgentChange(agentId);
  };
  
  const handleSaveObjectId = async (objectId: string): Promise<void> => {
    if (formData && setFormData) {
      setFormData({
        ...formData,
        object_id: objectId
      });
      // Additional logic to save to database if needed
      return Promise.resolve();
    }
    return Promise.reject("Form data not available");
  };
  
  const handleWebView = (e: React.MouseEvent) => {
    console.log("Web view clicked");
    // Implementation would go here
  };
  
  const handleGeneratePDF = (e: React.MouseEvent) => {
    console.log("Generate PDF clicked");
    // Implementation would go here
  };

  if (isLoading) {
    return <PropertyFormLoader />;
  }

  if (!formData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-center text-gray-500">Property not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{formData.title || "Untitled Property"}</h1>
        <div className="flex items-center gap-4">
          <PropertyAgentDetail
            agent={agentInfo}
            agents={agents}
            onChange={handleAgentChange}
            agentId={selectedAgent}
          />
        </div>
      </div>

      <Separator className="mb-6" />

      <Tabs value={activeTab} className="w-full">
        <PropertyTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          propertyId={id || ""}
        >
          <TabsContent value="dashboard">
            <DashboardTabContent
              property={formData}
              onDelete={deleteProperty}
              onSave={saveProperty}
              onWebView={handleWebView}
              handleSaveAgent={handleSaveAgent}
              handleSaveObjectId={handleSaveObjectId}
              handleGeneratePDF={handleGeneratePDF}
            />
          </TabsContent>
          <TabsContent value="content">
            <PropertyFormContent
              formData={formData}
              settings={settings}
              isSubmitting={isSubmitting}
              onSave={saveProperty}
              initialStep={initialContentStep}
            />
          </TabsContent>
          <TabsContent value="media">
            <div className="space-y-6 pb-4">
              <h2 className="text-2xl font-bold">Media</h2>
              {/* Media tab content */}
            </div>
          </TabsContent>
          <TabsContent value="communications">
            <CommunicationsTab propertyId={id || ""} propertyTitle={formData.title || "Untitled Property"} />
          </TabsContent>
          <TabsContent value="participants">
            <ParticipantsTab propertyId={id || ""} propertyTitle={formData.title || "Untitled Property"} />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTab propertyId={id || ""} propertyTitle={formData.title || "Untitled Property"} />
          </TabsContent>
        </PropertyTabs>
      </Tabs>
    </div>
  );
}
