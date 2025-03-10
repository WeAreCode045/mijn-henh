
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PropertyAgentSelectorProps {
  propertyId?: string;
  agentId?: string | null;
  agents: any[];
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
  setAgentInfo: (info: {id: string, name: string} | null) => void;
}

export function PropertyAgentSelector({
  propertyId,
  agentId,
  agents,
  selectedAgent,
  onAgentSelect,
  setAgentInfo
}: PropertyAgentSelectorProps) {
  const { toast } = useToast();

  useEffect(() => {
    // Update agent info when selectedAgent changes or on initial load
    if (agentId) {
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        setAgentInfo({ id: agent.id, name: agent.full_name });
      }
    }
  }, [agentId, agents, setAgentInfo]);

  return { onAgentSelect };
}
