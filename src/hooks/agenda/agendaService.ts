
import { supabase } from "@/integrations/supabase/client";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export const fetchAgendaItems = async (userId: string, propertyId?: string) => {
  console.log("agendaService - Fetching items for userId:", userId, "propertyId:", propertyId);
  
  let query = supabase
    .from('property_agenda_items')
    .select(`
      *,
      property:property_id (
        id,
        title
      )
    `)
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true });
  
  if (propertyId) {
    // If propertyId is provided, just filter by that property
    console.log("agendaService - Filtering by property:", propertyId);
    query = query.eq('property_id', propertyId);
  } else {
    // Show items where the user is:
    // 1. The agent who created the item OR
    // 2. In the additional_users array
    console.log("agendaService - Filtering by user:", userId);
    query = query.or(`agent_id.eq.${userId},additional_users.cs.["${userId}"]`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("agendaService - Error fetching:", error);
    throw error;
  }
  
  console.log("agendaService - Fetched data:", data);
  
  if (data) {
    const formattedData = data.map(item => ({
      id: item.id,
      agent_id: item.agent_id,
      property_id: item.property_id,
      title: item.title,
      description: item.description,
      event_date: item.event_date,
      event_time: item.event_time,
      end_date: item.end_date,
      end_time: item.end_time,
      additional_users: Array.isArray(item.additional_users) 
        ? item.additional_users.map(user => String(user))
        : typeof item.additional_users === 'object' && item.additional_users !== null
          ? Object.values(item.additional_users).map(user => String(user))
          : [],
      created_at: item.created_at,
      updated_at: item.updated_at,
      property: item.property
    })) as AgendaItem[];
    
    console.log("agendaService - Formatted data:", formattedData);
    return formattedData;
  }
  
  return [];
};

export const addAgendaItem = async (
  userId: string,
  title: string, 
  description: string | null, 
  eventDate: string, 
  eventTime: string,
  endDate: string | null = null,
  endTime: string | null = null,
  additionalUsers: string[] = [],
  propertyId?: string | null
) => {
  // If this item is linked to a property, get the property's agent
  let allAdditionalUsers = [...additionalUsers];
  
  if (propertyId) {
    const { data: propertyData } = await supabase
      .from('properties')
      .select('agent_id')
      .eq('id', propertyId)
      .single();
      
    if (propertyData && propertyData.agent_id && propertyData.agent_id !== userId) {
      // Add the property's agent to additional users if they're not already the creating agent
      allAdditionalUsers = [...allAdditionalUsers, propertyData.agent_id];
    }
  }
  
  // Remove duplicates
  allAdditionalUsers = [...new Set(allAdditionalUsers)];

  const { error } = await supabase
    .from('property_agenda_items')
    .insert({
      agent_id: userId,
      property_id: propertyId || null,
      title,
      description,
      event_date: eventDate,
      event_time: eventTime,
      end_date: endDate,
      end_time: endTime || null,
      additional_users: allAdditionalUsers
    });

  if (error) throw error;
};

export const deleteAgendaItem = async (agendaItemId: string) => {
  const { error } = await supabase
    .from('property_agenda_items')
    .delete()
    .eq('id', agendaItemId);

  if (error) throw error;
};

export const updateAgendaItem = async (
  agendaItemId: string, 
  title: string, 
  description: string | null, 
  eventDate: string, 
  eventTime: string,
  endDate: string | null = null,
  endTime: string | null = null,
  additionalUsers: string[] = [],
  propertyId?: string | null
) => {
  // If this item is linked to a property, get the property's agent
  let allAdditionalUsers = [...additionalUsers];
  
  if (propertyId) {
    const { data: propertyData } = await supabase
      .from('properties')
      .select('agent_id')
      .eq('id', propertyId)
      .single();
      
    if (propertyData && propertyData.agent_id) {
      // Add the property's agent to additional users if not already there
      if (!allAdditionalUsers.includes(propertyData.agent_id)) {
        allAdditionalUsers.push(propertyData.agent_id);
      }
    }
  }
  
  // Create update object with required fields
  const updateObj: any = {
    property_id: propertyId,
    title,
    description,
    event_date: eventDate,
    event_time: eventTime,
    additional_users: allAdditionalUsers
  };
  
  // Only add end_date if it has a value
  if (endDate) {
    updateObj.end_date = endDate;
  } else {
    updateObj.end_date = null;
  }
  
  // Only add end_time if it has a value
  if (endTime && endTime.trim() !== "") {
    updateObj.end_time = endTime;
  } else {
    updateObj.end_time = null;
  }

  const { error } = await supabase
    .from('property_agenda_items')
    .update(updateObj)
    .eq('id', agendaItemId);

  if (error) throw error;
};
