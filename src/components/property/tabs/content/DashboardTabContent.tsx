
import React from 'react';
import { PropertyData } from "@/types/property";
import { PropertyOverviewCard } from "@/components/property/dashboard/PropertyOverviewCard";
import { ExternalLinksCard } from "@/components/property/dashboard/ExternalLinksCard";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete?: () => Promise<void>;
  onWebView?: (e?: React.MouseEvent) => void;
  handleSaveAgent?: (agentId: string) => void;
  handleSaveObjectId?: (objectId: string) => void;
  handleSaveTemplate?: (templateId: string) => void;
  handleGeneratePDF?: (e: React.MouseEvent) => void;
  isUpdating?: boolean;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
}

export function DashboardTabContent({
  property,
  onDelete,
  onWebView,
  handleSaveAgent,
  handleSaveObjectId,
  handleSaveTemplate,
  handleGeneratePDF,
  isUpdating = false,
  agentInfo,
  templateInfo
}: DashboardTabContentProps) {
  return (
    <div className="space-y-6">
      <PropertyOverviewCard 
        property={property} 
        handleSaveAgent={handleSaveAgent}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExternalLinksCard property={property} />
      </div>
    </div>
  );
}
