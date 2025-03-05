import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const colors = {
  primary: '#9b87f5',
  secondary: '#7E69AB',
  tertiary: '#6E59A5',
  light: '#D6BCFA',
  soft: '#E5DEFF',
  vivid: '#8B5CF6',
  magenta: '#D946EF',
};

const generateEnhancedDescriptions = async (property) => {
  const propertyPrompt = `
    Schrijf een professionele makelaarstekst voor deze woning in het Nederlands:
    Titel: ${property.title}
    Prijs: ${property.price}
    Locatie: ${property.address}
    Kenmerken: ${property.features?.map((f) => f.description).join(', ')}
    
    Maak het aantrekkelijk en professioneel, en benadruk de belangrijkste verkooppunten.
    Maximaal 300 woorden.
    Gebruik een wervende maar betrouwbare toon.
  `;

  const areaPrompt = `
    Schrijf een aantrekkelijke beschrijving van de buurt in het Nederlands, gebaseerd op deze voorzieningen:
    ${JSON.stringify(property.nearby_places)}
    
    Benadruk het gemak en de voordelen van de locatie.
    Maximaal 200 woorden.
    Focus op bereikbaarheid, voorzieningen en leefbaarheid.
  `;

  const [propertyResponse, areaResponse] = await Promise.all([
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Je bent een professionele Nederlandse makelaar.' },
          { role: 'user', content: propertyPrompt }
        ],
      }),
    }),
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Je bent een professionele Nederlandse makelaar.' },
          { role: 'user', content: areaPrompt }
        ],
      }),
    })
  ]);

  const [propertyData, areaData] = await Promise.all([
    propertyResponse.json(),
    areaResponse.json()
  ]);

  return {
    propertyDescription: propertyData.choices[0].message.content,
    areaDescription: areaData.choices[0].message.content
  };
};

const createBrochurePDF = (property, settings, descriptions) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const addHeaderFooter = (pageNum, totalPages) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    if (settings?.logoUrl) {
      try {
        doc.addImage(settings.logoUrl, 'PNG', 20, 5, 40, 20);
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    }

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    const contactX = 70;
    let contactDetails = [];
    if (settings?.name) contactDetails.push(settings.name);
    if (settings?.phone) contactDetails.push(settings.phone);
    if (settings?.email) contactDetails.push(settings.email);
    doc.text(contactDetails.join(' | '), contactX, 18);
    
    doc.setFillColor(colors.secondary);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(property.title, 20, pageHeight - 8);
    doc.text(`Pagina ${pageNum} van ${totalPages}`, pageWidth - 40, pageHeight - 8);
  };

  if (property.featuredImage) {
    try {
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.addImage(property.featuredImage, 'JPEG', 20, 40, pageWidth - 40, 100);
    } catch (error) {
      console.error('Error adding featured image:', error);
    }
  }

  doc.setFillColor(colors.primary);
  doc.rect(0, 150, doc.internal.pageSize.getWidth(), 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(property.title, 20, 170);
  doc.setFontSize(20);
  doc.text(`Prijs: ${property.price}`, 20, 182);

  addHeaderFooter(1, 4);

  doc.addPage();
  addHeaderFooter(2, 4);

  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(colors.primary);
  doc.roundedRect(20, 40, doc.internal.pageSize.getWidth() - 40, 80, 3, 3, 'FD');

  const details = [
    { label: 'Woonoppervlak', value: `${property.livingArea} m²` },
    { label: 'Perceeloppervlak', value: `${property.sqft} m²` },
    { label: 'Slaapkamers', value: property.bedrooms },
    { label: 'Badkamers', value: property.bathrooms },
    { label: 'Bouwjaar', value: property.buildYear }
  ];

  doc.setTextColor(60, 60, 60);
  let yPos = 60;
  details.forEach(detail => {
    doc.setFontSize(10);
    doc.text(detail.label, 30, yPos);
    doc.setFontSize(12);
    doc.text(detail.value.toString(), 30, yPos + 8);
    yPos += 20;
  });

  doc.setTextColor(colors.primary);
  doc.setFontSize(16);
  doc.text('Beschrijving', 20, 140);
  
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  const splitDescription = doc.splitTextToSize(descriptions.propertyDescription, 170);
  doc.text(splitDescription, 20, 155);

  doc.addPage();
  addHeaderFooter(3, 4);

  doc.setTextColor(colors.primary);
  doc.setFontSize(16);
  doc.text('Locatie & Omgeving', 20, 40);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  const splitAreaDesc = doc.splitTextToSize(descriptions.areaDescription, 170);
  doc.text(splitAreaDesc, 20, 55);

  if (property.map_image) {
    try {
      const mapImage = property.map_image.split(',')[1];
      doc.addImage(mapImage, 'PNG', 20, 120, 170, 85);
    } catch (error) {
      console.error('Error adding map image:', error);
    }
  }

  doc.addPage();
  addHeaderFooter(4, 4);

  doc.setTextColor(colors.primary);
  doc.setFontSize(16);
  doc.text('Kenmerken', 20, 40);

  if (property.features && property.features.length > 0) {
    let yPos = 60;
    const xPos = 30;
    
    property.features.forEach((feature) => {
      if (yPos > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        addHeaderFooter(4, 4);
        yPos = 60;
      }
      
      doc.setFillColor(colors.primary);
      doc.circle(xPos - 5, yPos - 1, 1, 'F');
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.text(feature.description, xPos, yPos);
      
      yPos += 10;
    });
  }

  return doc.output('datauristring');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);
    
    // Fetch property and agency settings
    const [propertyResult, settingsResult] = await Promise.all([
      supabase.from('properties').select('*').eq('id', propertyId).single(),
      supabase.from('agency_settings').select('*').single()
    ]);

    if (propertyResult.error) throw propertyResult.error;
    if (settingsResult.error) throw settingsResult.error;

    const property = propertyResult.data;
    const settings = settingsResult.data;

    // Generate enhanced descriptions using GPT-4
    const descriptions = await generateEnhancedDescriptions(property);
    
    // Create the PDF document
    const pdfOutput = createBrochurePDF(property, settings, descriptions);

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdf: pdfOutput 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
