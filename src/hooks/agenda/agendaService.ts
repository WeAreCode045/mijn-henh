
import { supabase } from "@/integrations/supabase/client";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export const fetchAgendaItems = async (userId: string, propertyId?: string) => {
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
    query = query.eq('property_id', propertyId);
  } else {
    // Show items where the user is:
    // 1. The agent who created the item OR
    // 2. In the additional_users array OR
    // 3. The agent assigned to the property
    query = query.or(`agent_id.eq.${userId},additional_users.cs.{"${userId}"},property_id.in.(select id from properties where agent_id = '${userId}')`);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  if (data) {
    return data.map(item => ({
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
      additional_users: additionalUsers
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
  // Create update object with required fields
  const updateObj: any = {
    property_id: propertyId,
    title,
    description,
    event_date: eventDate,
    event_time: eventTime,
    additional_users: additionalUsers
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
