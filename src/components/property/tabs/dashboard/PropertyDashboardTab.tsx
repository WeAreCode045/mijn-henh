
import React, { useCallback } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  // Implement a proper function to save the agent ID to the database
  const handleSaveAgent = useCallback(async (agentId: string | null): Promise<void> => {
    console.log("PropertyDashboardTab - Saving agent ID:", agentId, "for property:", propertyId);
    
    if (!propertyId) {
      console.error("Cannot save agent: Property ID is missing");
      toast({
        title: "Error",
        description: "Cannot save agent - property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }
    
    try {
      // Update the database directly
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: agentId })
        .eq('id', propertyId);
      
      if (error) {
        console.error("Error updating agent in database:", error);
        toast({
          title: "Error",
          description: "Failed to save agent to database",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Agent saved successfully for property:", propertyId);
      toast({
        description: "Agent assigned successfully",
      });
      
      // Call onSave to refresh the form data if needed
      if (onSave) onSave();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error in handleSaveAgent:", error);
      return Promise.reject(error);
    }
  }, [propertyId, toast, onSave]);

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
          handleSaveAgent={handleSaveAgent}
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
