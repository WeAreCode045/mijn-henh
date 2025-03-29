
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
  // IMPORTANT: We need to provide a default property ID if none is provided
  // since the database schema requires a non-null property_id
  let finalPropertyId = propertyId;
  
  // Only fetch a default property if propertyId is null, undefined, or the special dummy UUID
  if (!finalPropertyId || finalPropertyId === '00000000-0000-0000-0000-000000000000') {
    console.log("No property ID provided, fetching a default property");
    
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id')
      .limit(1);
    
    if (propertiesError) {
      console.error("Error fetching default property:", propertiesError);
      throw propertiesError;
    }
    
    if (properties && properties.length > 0) {
      finalPropertyId = properties[0].id;
      console.log("Using default property ID:", finalPropertyId);
    } else {
      console.error("No properties found and property_id cannot be null");
      throw new Error("Cannot create agenda item: No property found and property_id cannot be null");
    }
  }
  
  // Log what's being sent to the database for debugging
  console.log("Adding agenda item with:", {
    userId,
    propertyId: finalPropertyId,
    title,
    description,
    eventDate,
    eventTime,
    endDate,
    endTime,
    additionalUsers
  });
  
  // If this item is linked to a property, get the property's agent
  let allAdditionalUsers = [...additionalUsers];
  
  if (finalPropertyId) {
    const { data: propertyData } = await supabase
      .from('properties')
      .select('agent_id')
      .eq('id', finalPropertyId)
      .single();
      
    if (propertyData && propertyData.agent_id && propertyData.agent_id !== userId) {
      // Add the property's agent to additional users if they're not already the creating agent
      allAdditionalUsers = [...allAdditionalUsers, propertyData.agent_id];
    }
  }
  
  // Remove duplicates and ensure additionalUsers is a proper JSON array
  allAdditionalUsers = [...new Set(allAdditionalUsers)];

  const { error } = await supabase
    .from('property_agenda_items')
    .insert({
      agent_id: userId,
      property_id: finalPropertyId,
      title,
      description,
      event_date: eventDate,
      event_time: eventTime,
      end_date: endDate,
      end_time: endTime || null,
      additional_users: allAdditionalUsers
    });

  if (error) {
    console.error("Error inserting agenda item:", error);
    throw error;
  }
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
    title,
    description,
    event_date: eventDate,
    event_time: eventTime
  };
  
  // Only update propertyId if it's provided and not the dummy UUID
  if (propertyId !== undefined) {
    if (propertyId === null || propertyId === '00000000-0000-0000-0000-000000000000') {
      // Fetch a default property ID if needed since property_id cannot be null
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .limit(1);
      
      if (propertiesError) {
        console.error("Error fetching default property:", propertiesError);
        throw propertiesError;
      }
      
      if (properties && properties.length > 0) {
        updateObj.property_id = properties[0].id;
      } else {
        throw new Error("Cannot update agenda item: No property found and property_id cannot be null");
      }
    } else {
      updateObj.property_id = propertyId;
    }
    
    // If this item is linked to a property, get the property's agent
    if (updateObj.property_id) {
      const { data: propertyData } = await supabase
        .from('properties')
        .select('agent_id')
        .eq('id', updateObj.property_id)
        .single();
        
      if (propertyData && propertyData.agent_id) {
        // Add the property's agent to additional users if not already there
        if (!additionalUsers.includes(propertyData.agent_id)) {
          additionalUsers = [...additionalUsers, propertyData.agent_id];
        }
      }
    }
  }
  
  // Process additional users - ensure it's a proper JSON array
  updateObj.additional_users = [...new Set(additionalUsers)];
  
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

  if (error) {
    console.error("Error updating agenda item:", error);
    throw error;
  }
};
