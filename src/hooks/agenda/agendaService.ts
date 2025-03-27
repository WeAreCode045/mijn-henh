
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
    query = query.or(`agent_id.eq.${userId},additional_users.cs.{"${userId}"}`);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  if (data) {
    // Transform the data to ensure it matches the AgendaItem type
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
      // Convert additional_users to string[] regardless of what form it comes in
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
      end_time: endTime,
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
  const { error } = await supabase
    .from('property_agenda_items')
    .update({
      property_id: propertyId,
      title,
      description,
      event_date: eventDate,
      event_time: eventTime,
      end_date: endDate,
      end_time: endTime,
      additional_users: additionalUsers
    })
    .eq('id', agendaItemId);

  if (error) throw error;
};
