
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Update property with new nearby places data
export async function updatePropertyWithPlaces(
  propertyId: string, 
  lat: number, 
  lng: number,
  places: any[]
) {
  if (!propertyId) {
    console.log('No property ID provided, skipping database update');
    return;
  }
  
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabaseAdmin
      .from('properties')
      .update({
        latitude: lat,
        longitude: lng,
        nearby_places: places
      })
      .eq('id', propertyId);

    if (updateError) {
      throw updateError;
    }
    
    console.log(`Updated property ${propertyId} with ${places.length} places`);
  } catch (error) {
    console.error('Error updating property in database:', error);
    throw error;
  }
}
