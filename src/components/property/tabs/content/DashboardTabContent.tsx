
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{property.title || 'Untitled Property'}</h1>
          <p className="text-muted-foreground mt-1">{property.address?.street}, {property.address?.city}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {property.type || 'Residential'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main overview card */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Property Overview</CardTitle>
            <CardDescription>
              Created on {new Date(property.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {featuredImage && (
                <div className="md:w-1/3">
                  <img 
                    src={featuredImage} 
                    alt={property.title} 
                    className="rounded-md w-full h-auto object-cover aspect-[4/3]"
                  />
                </div>
              )}
              <div className={featuredImage ? "md:w-2/3" : "w-full"}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium">Property ID</p>
                    <p className="text-sm text-muted-foreground">{property.id.substring(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Object ID</p>
                    <p className="text-sm text-muted-foreground">{property.object_id || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Agent</p>
                    <p className="text-sm text-muted-foreground">{agentInfo?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Template</p>
                    <p className="text-sm text-muted-foreground">{templateInfo?.name || 'Default'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">
                      {property.price ? `€${property.price.toLocaleString()}` : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Size</p>
                    <p className="text-sm text-muted-foreground">
                      {property.size ? `${property.size} m²` : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions card */}
        <ActionsCard 
          onDelete={onDelete}
          onWebView={handleWebView}
          id={property.id}
          createdAt={property.created_at}
          updatedAt={property.updated_at}
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
