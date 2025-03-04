
import { PropertyData } from '@/types/property';
import { AgencySettings } from '@/types/agency';
import { pdf } from '@react-pdf/renderer';
import { PropertyBrochureDocument } from './pdf/PropertyBrochureDocument';
import { supabase } from '@/integrations/supabase/client';
import type { Section } from '@/components/brochure/TemplateBuilder';

export const generatePropertyPDF = async (property: PropertyData, settings: AgencySettings, templateId?: string) => {
  try {
    let template;
    
    if (templateId) {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (error) throw error;
      template = data;
    }

    // Ensure all arrays exist and are properly populated
    const sanitizedProperty = {
      ...property,
      areas: property.areas.map(area => ({
        ...area,
        imageIds: area.imageIds || [] // Ensure imageIds exists
      })),
      images: property.images || [],
      coverImages: (property.coverImages || []).slice(0, 6),
      features: (property.features || []).slice(0, 10),
      nearby_places: (property.nearby_places || []).slice(0, 5),
    };

    console.log('Generating PDF with areas:', sanitizedProperty.areas);
    console.log('Total images:', sanitizedProperty.images.length);

    const blob = await pdf(PropertyBrochureDocument({ 
      property: sanitizedProperty, 
      settings,
      template: template?.sections as Section[] | undefined
    })).toBlob();
    
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
