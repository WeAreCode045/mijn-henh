
import { supabase } from "@/integrations/supabase/client";

export async function getOrCreateWebViewUrl(propertyId: string, objectId: string): Promise<string | null> {
  try {
    // First, try to get existing web view URL
    const { data: existingView, error } = await supabase
      .from('property_web_views')
      .select('object_id')
      .eq('property_id', propertyId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching web view:', error);
      return null;
    }

    if (existingView) {
      // Use consistent format with /property/view/ path
      return `/property/view/${existingView.object_id}`;
    }

    // If no existing view, create a new one
    const { error: insertError } = await supabase
      .from('property_web_views')
      .insert({
        property_id: propertyId,
        object_id: objectId
      });

    if (insertError) {
      console.error('Error creating web view URL:', insertError);
      return null;
    }

    // Use consistent format with /property/view/ path
    return `/property/view/${objectId}`;
  } catch (error) {
    console.error('Unexpected error in getOrCreateWebViewUrl:', error);
    return null;
  }
}
