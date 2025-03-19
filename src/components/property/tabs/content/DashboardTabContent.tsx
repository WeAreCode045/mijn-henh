
import React from 'react';
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPropertyMainImageUrl } from "@/utils/imageUrlHelpers";
import { NotesCard } from "@/components/property/dashboard/NotesCard";
import { AgendaCard } from "@/components/property/dashboard/AgendaCard";
import { ActionsCard } from "@/components/property/dashboard/ActionsCard";
import { SubmissionsCard } from "@/components/property/dashboard/SubmissionsCard";
import { ExternalLinksCard } from "@/components/property/dashboard/ExternalLinksCard";
import { PropertyOverviewCard } from "@/components/property/dashboard/PropertyOverviewCard";
import { Button } from "@/components/ui/button";
import { FileDown, Globe } from "lucide-react";

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
  const featuredImage = getPropertyMainImageUrl(property);
  const handleWebView = onWebView ? (e?: React.MouseEvent) => onWebView(e) : undefined;

  // Helper function to format address
  const renderAddress = () => {
    if (!property.address) {
      return ''; // Return empty string if address is null or undefined
    }
    
    if (typeof property.address === 'object') {
      // For object-based addresses - using non-null assertion after the check
      const addressObj = property.address as { street?: string; city?: string };
      const street = addressObj.street || '';
      const city = addressObj.city || '';
      return `${street}${street && city ? ', ' : ''}${city}`;
    } else {
      // For string addresses - address is already verified as non-null
      return property.address;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{property.title || 'Untitled Property'}</h1>
          <p className="text-muted-foreground mt-1">
            {renderAddress()}
          </p>
        </div>
        <div className="flex gap-2">
          {handleWebView && (
            <Button variant="outline" size="sm" onClick={handleWebView} title="Web View">
              <Globe className="h-4 w-4 mr-2" />
              Web View
            </Button>
          )}
          {handleGeneratePDF && (
            <Button variant="outline" size="sm" onClick={handleGeneratePDF} title="Generate PDF">
              <FileDown className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main overview card */}
        <PropertyOverviewCard 
          property={property} 
          handleSaveAgent={handleSaveAgent}
        />

        {/* Actions card */}
        <ActionsCard 
          onDelete={onDelete}
          onWebView={handleWebView}
          id={property.id}
          createdAt={property.created_at}
          updatedAt={property.updated_at}
          showEdit={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* External links card */}
        <ExternalLinksCard property={property} />
        
        {/* Submissions card */}
        <SubmissionsCard propertyId={property.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes card */}
        <NotesCard propertyId={property.id} />
        
        {/* Agenda card */}
        <AgendaCard propertyId={property.id} />
      </div>
    </div>
  );
}
