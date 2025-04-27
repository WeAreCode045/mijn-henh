
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyDetailsCard } from "./cards/PropertyDetailsCard";
import { PropertyStatsCard } from "../../dashboard/PropertyStatsCard";
import { SubmissionsCard } from "../../dashboard/SubmissionsCard";
import { PropertyTitleEditor } from "../../dashboard/PropertyTitleEditor";
import { PropertyManagementCard } from "./cards/PropertyManagementCard";
import { DocumentManagement } from "../../documents/DocumentManagement";
import { usePropertyActions } from "@/hooks/usePropertyActions";

interface PropertyDashboardTabProps {
  formData: PropertyFormData;
  propertyId: string;
  onDelete?: () => Promise<void>;
  onSave?: () => void;
}

export function PropertyDashboardTab({
  formData,
  propertyId,
  onDelete,
  onSave = () => {},
}: PropertyDashboardTabProps) {
  const { handleGeneratePDF, handleWebView } = usePropertyActions(propertyId);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Dashboard</h2>
      
      {/* Property Title Editor */}
      <PropertyTitleEditor property={formData} onSave={onSave} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Details Card */}
        <PropertyDetailsCard property={formData} />

        {/* Property Management Card with Action Buttons */}
        <PropertyManagementCard
          propertyId={propertyId}
          agentId={formData.agent_id}
          onGeneratePDF={handleGeneratePDF}
          onWebView={handleWebView}
          onDelete={onDelete || (async () => {})}
          handleSaveAgent={async () => {}}
          createdAt={formData.created_at}
          updatedAt={formData.updated_at}
          virtualTourUrl={formData.virtualTourUrl}
          youtubeUrl={formData.youtubeUrl}
        />

        {/* Property Stats Card */}
        <PropertyStatsCard property={formData} />

        {/* Recent Submissions Card */}
        <SubmissionsCard propertyId={propertyId} />
        
        {/* Documents Management */}
        <DocumentManagement propertyId={propertyId} />
      </div>
    </div>
  );
}
