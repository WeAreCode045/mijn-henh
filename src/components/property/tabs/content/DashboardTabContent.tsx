
import React from "react";
import { PropertyData } from "@/types/property";
import { PropertyOverviewCard } from "../../dashboard/PropertyOverviewCard";
import { ActionsCard } from "../../dashboard/ActionsCard";
import { ExternalLinksCard } from "../../dashboard/ExternalLinksCard";
import { PropertyStatsCard } from "../../dashboard/PropertyStatsCard";
import { SubmissionsCard } from "../../dashboard/SubmissionsCard";
import { NotesCard } from "../../dashboard/NotesCard";
import { AgendaCard } from "../../dashboard/AgendaCard";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete?: () => Promise<void>;
  onWebView?: () => void;
  handleSaveAgent?: (agentId: string) => void;
}

export function DashboardTabContent({ 
  property, 
  onDelete, 
  onWebView,
  handleSaveAgent
}: DashboardTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <PropertyOverviewCard 
          property={property} 
          handleSaveAgent={handleSaveAgent} 
        />
        
        <ActionsCard 
          title="Property Actions"
          description="Manage this property"
          id={property.id}
          onDelete={onDelete}
          onWebView={onWebView}
          showDelete={true}
          showEdit={false}
          showCreate={false}
          createdAt={property.created_at}
          updatedAt={property.updated_at}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotesCard propertyId={property.id} />
        <AgendaCard propertyId={property.id} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SubmissionsCard propertyId={property.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExternalLinksCard property={property} />
        <PropertyStatsCard property={property} />
      </div>
    </div>
  );
}
