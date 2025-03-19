
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PropertyImageUpload } from "@/components/property/PropertyImageUpload";
import { Trash2, FileDown, Globe } from "lucide-react";

interface PropertyActionsPanelProps {
  propertyData: any;
  agencySettings?: any;
  isAdmin?: boolean;
  agents?: Array<{ id: string; name: string }>;
  selectedAgent?: string;
  onAgentSelect?: (agentId: string) => void;
  onDeleteProperty?: () => void;
  onSaveProperty?: () => void;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage?: (index: number) => void;
  images?: string[];
  onGeneratePDF?: (e: React.MouseEvent) => void;
  onOpenWebView?: (e: React.MouseEvent) => void;
}

export function PropertyActionsPanel({
  propertyData,
  agencySettings,
  isAdmin = false,
  agents = [],
  selectedAgent,
  onAgentSelect,
  onDeleteProperty,
  onSaveProperty,
  onImageUpload,
  onRemoveImage,
  images = [],
  onGeneratePDF,
  onOpenWebView
}: PropertyActionsPanelProps) {
  return (
    <div className="w-full lg:w-80 space-y-4">
      {/* Property Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            {onOpenWebView && (
              <Button onClick={onOpenWebView} className="w-full" variant="outline">
                <Globe className="mr-2 h-4 w-4" />
                Open Web View
              </Button>
            )}
            
            {onGeneratePDF && (
              <Button onClick={onGeneratePDF} className="w-full" variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
            
            {onDeleteProperty && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={onDeleteProperty}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Property
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent Assignment */}
      {isAdmin && agents.length > 0 && onAgentSelect && (
        <Card>
          <CardHeader>
            <CardTitle>Assigned Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="agent-select">Select Agent</Label>
              <Select
                value={selectedAgent || ''}
                onValueChange={onAgentSelect}
              >
                <SelectTrigger id="agent-select">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Images (if provided) */}
      {onImageUpload && onRemoveImage && (
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyImageUpload
              images={images}
              onUpload={onImageUpload}
              onRemove={onRemoveImage}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
