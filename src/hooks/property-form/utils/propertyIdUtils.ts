
import { supabase } from "@/integrations/supabase/client";

/**
 * Retrieves the ID of a newly created property by title
 * @param title The title of the newly created property
 * @returns The property ID or null if not found
 */
export async function getNewPropertyId(title: string): Promise<string | null> {
  const { data: newProperty } = await supabase
    .from('properties')
    .select('id')
    .eq('title', title)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  return newProperty?.id || null;
}
