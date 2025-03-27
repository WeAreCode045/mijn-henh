
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
  assignedToId?: string | null;
  propertyId?: string | null;
  onAssignedToChange: (id: string | null) => void;
  onPropertyChange?: (id: string | null) => void;
}

export function TodoAssignmentFields({
  assignedToId,
  propertyId,
  onAssignedToChange,
  onPropertyChange
}: TodoAssignmentFieldsProps) {
  const [agents, setAgents] = useState<{id: string; full_name: string}[]>([]);
  
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
    
    fetchAgents();
  }, []);

  // Ensure we always have valid values for selects
  const safeAssignedToId = assignedToId || "unassigned";

  return (
    <div className="grid gap-2">
      <Label htmlFor="agent">Assign to Agent (optional)</Label>
      <Select 
        value={safeAssignedToId}
        onValueChange={(value) => onAssignedToChange(value === "unassigned" ? null : value)}
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
  );
}
