
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, propertyId, folder = 'photos' } = await req.json()

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'No image URL provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Processing download request for: ${imageUrl}`)
    console.log(`Property ID: ${propertyId}, Folder: ${folder}`)

    // Download the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image from ${imageUrl}`)
    }

    const imageBlob = await imageResponse.blob()
    const fileExt = imageUrl.split('.').pop()?.toLowerCase() || 'jpg'
    const sanitizedExt = fileExt.includes('?') ? fileExt.split('?')[0] : fileExt
    const fileName = `${crypto.randomUUID()}.${sanitizedExt}`

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Prepare the storage path based on property ID and folder
    const storagePath = propertyId 
      ? `properties/${propertyId}/${folder}/${fileName}`
      : `agency_files/${fileName}`
    
    const bucket = propertyId ? 'properties' : 'agency_files'

    console.log(`Uploading to bucket: ${bucket}, path: ${storagePath}`)

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, imageBlob, {
        contentType: imageBlob.type,
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath)

    if (urlError) {
      throw urlError
    }

    console.log(`Successfully processed image. Public URL: ${publicUrl}`)

    return new Response(
      JSON.stringify({ publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error("Error in download-image function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
