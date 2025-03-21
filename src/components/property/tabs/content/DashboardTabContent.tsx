
import React from "react";
import { PropertyData } from "@/types/property";
import { PropertyOverviewCard } from "../../dashboard/PropertyOverviewCard";
import { ActionsCard } from "../../dashboard/ActionsCard";
import { NotesCard } from "../../dashboard/NotesCard";
import { AgendaCard } from "../../dashboard/AgendaCard";

interface DashboardTabContentProps {
  property: PropertyData;
  onDelete?: () => Promise<void>;
  onSave?: () => void;
  onWebView?: (e: React.MouseEvent) => void;
  handleSaveAgent?: (agentId: string) => Promise<void>;
}

export function DashboardTabContent({ 
  property, 
  onDelete, 
  onSave, 
  onWebView,
  handleSaveAgent
}: DashboardTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <PropertyOverviewCard 
            property={property}
            handleSaveAgent={handleSaveAgent}
          />
        </div>
        
        <div className="lg:col-span-1">
          <ActionsCard 
            propertyId={property.id}
            propertyData={property}
            createdAt={property.created_at}
            updatedAt={property.updated_at}
            onSave={onSave}
            onDelete={onDelete}
            onWebView={onWebView}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <NotesCard propertyId={property.id} />
        <AgendaCard propertyId={property.id} />
      </div>
    </div>
  );
}
