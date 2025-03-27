
import { supabase } from "@/integrations/supabase/client";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export const fetchPropertyAgendaItems = async (propertyId: string) => {
  const { data, error } = await supabase
    .from('property_agenda_items')
    .select('*')
    .eq('property_id', propertyId)
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true });

  if (error) throw error;
  
  if (data) {
    // Transform the data to ensure it matches the AgendaItem type
    const formattedData: AgendaItem[] = data.map(item => ({
      id: item.id,
      creator_id: item.creator_id,
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
      updated_at: item.updated_at
    }));
    
    return formattedData;
  }
  
  return [];
};

export const addPropertyAgendaItem = async (
  userId: string,
  propertyId: string,
  title: string, 
  description: string | null, 
  date: string, 
  time: string,
  endDate: string | null = null,
  endTime: string | null = null,
  additionalUsers: string[] = []
) => {
  const newItem = {
    creator_id: userId,
    property_id: propertyId,
    title,
    description,
    event_date: date,
    event_time: time,
    end_date: endDate,
    end_time: endTime,
    additional_users: additionalUsers
  };

  const { data, error } = await supabase
    .from('property_agenda_items')
    .insert(newItem)
    .select();

  if (error) throw error;

  if (data && data[0]) {
    // Transform to match AgendaItem type
    const newAgendaItem: AgendaItem = {
      id: data[0].id,
      creator_id: data[0].creator_id,
      property_id: data[0].property_id,
      title: data[0].title,
      description: data[0].description,
      event_date: data[0].event_date,
      event_time: data[0].event_time,
      end_date: data[0].end_date,
      end_time: data[0].end_time,
      additional_users: Array.isArray(data[0].additional_users) 
        ? data[0].additional_users.map(user => String(user))
        : typeof data[0].additional_users === 'object' && data[0].additional_users !== null
          ? Object.values(data[0].additional_users).map(user => String(user))
          : [],
      created_at: data[0].created_at,
      updated_at: data[0].updated_at
    };
    
    return newAgendaItem;
  }
  
  return null;
};

export const updatePropertyAgendaItem = async (
  id: string,
  title: string, 
  description: string | null, 
  date: string, 
  time: string,
  endDate: string | null = null,
  endTime: string | null = null,
  additionalUsers: string[] = []
) => {
  const updates = {
    title,
    description,
    event_date: date,
    event_time: time,
    end_date: endDate,
    end_time: endTime,
    additional_users: additionalUsers
  };

  const { data, error } = await supabase
    .from('property_agenda_items')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;

  if (data && data[0]) {
    return data[0];
  }
  
  return null;
};

export const deletePropertyAgendaItem = async (id: string) => {
  const { error } = await supabase
    .from('property_agenda_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  return true;
};
