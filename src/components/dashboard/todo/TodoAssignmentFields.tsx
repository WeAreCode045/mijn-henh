
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface TodoAssignmentFieldsProps {
  assignedToId: string | null;
  propertyId: string | null;
  onAssignedToIdChange: (id: string | null) => void;
  onPropertyIdChange: (id: string | null) => void;
}

export function TodoAssignmentFields({
  assignedToId,
  propertyId,
  onAssignedToIdChange,
  onPropertyIdChange
}: TodoAssignmentFieldsProps) {
  const [agents, setAgents] = useState<{id: string; full_name: string}[]>([]);
  const [properties, setProperties] = useState<{id: string; title: string}[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
        
      if (!error && data) {
        // Make sure all agents have valid ids
        setAgents(data.map(agent => ({
          id: agent.id || `agent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          full_name: agent.full_name || "Unnamed Agent"
        })));
      }
    };
    
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .eq('archived', false)
        .order('title');
        
      if (!error && data) {
        // Make sure all properties have valid ids
        setProperties(data.map(property => ({
          id: property.id || `property-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title: property.title || `Property ${property.id?.substring(0, 8) || "Untitled"}`
        })));
      }
    };
    
    fetchAgents();
    fetchProperties();
  }, []);

  // Ensure we always have valid values for selects
  const safeAssignedToId = assignedToId || "unassigned";
  const safePropertyId = propertyId || "unassigned";

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="agent">Assign to Agent (optional)</Label>
        <Select 
          value={safeAssignedToId}
          onValueChange={(value) => onAssignedToIdChange(value === "unassigned" ? null : value)}
          defaultValue="unassigned"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {agents.map(agent => (
              <SelectItem 
                key={agent.id} 
                value={agent.id}
              >
                {agent.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="property">Assign to Property (optional)</Label>
        <Select 
          value={safePropertyId} 
          onValueChange={(value) => onPropertyIdChange(value === "unassigned" ? null : value)}
          defaultValue="unassigned"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a property" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {properties.map(property => (
              <SelectItem key={property.id} value={property.id}>
                {property.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
