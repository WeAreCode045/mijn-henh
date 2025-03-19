
import { PropertyAgent } from "@/types/property";

/**
 * Helper function to safely convert agent data to PropertyAgent type
 */
export const formatAgentData = (agentData: any): PropertyAgent | undefined => {
  if (!agentData) return undefined;
  
  if (typeof agentData === 'string') {
    return {
      id: agentData,
      name: 'Unknown Agent',
      email: '',
      phone: '',
    };
  }
  
  if (typeof agentData === 'object') {
    return {
      id: agentData.id || '',
      name: agentData.full_name || agentData.name || 'Unknown Agent', // Map both full_name or name
      email: agentData.email || '',
      phone: agentData.phone || '',
      photoUrl: agentData.avatar_url || agentData.photoUrl, // Map both avatar_url or photoUrl
      whatsapp_number: agentData.whatsapp_number || '',
    };
  }
  
  return undefined;
};
