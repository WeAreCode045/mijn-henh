
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
      name: agentData.full_name || 'Unknown Agent', // Map full_name to name
      email: agentData.email || '',
      phone: agentData.phone || '',
      photoUrl: agentData.avatar_url, // Map avatar_url to photoUrl
    };
  }
  
  return undefined;
};
