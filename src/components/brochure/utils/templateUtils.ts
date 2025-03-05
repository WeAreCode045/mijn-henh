
import { supabase } from '@/integrations/supabase/client';
import { Section, Container } from '../types/templateTypes';
import type { Json } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export const saveTemplate = async (
  templateId: string | undefined,
  templateName: string,
  description: string | null,
  sections: Section[]
) => {
  if (!templateName) {
    toast.error("Please enter a template name");
    return false;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to save templates");
      return false;
    }

    // Convert sections to a JSON-compatible format
    const sectionsJson = sections.map(section => ({
      ...section,
      design: {
        ...section.design,
        containers: section.design.containers.map(container => ({
          ...container,
          elements: container.elements.map(element => ({
            ...element
          }))
        }))
      }
    })) as Json;

    const templateData = {
      name: templateName,
      description: description || null,
      sections: sectionsJson,
      created_by: user.id
    };

    const { error } = await supabase
      .from('brochure_templates')
      .upsert({
        ...(templateId ? { id: templateId } : {}),
        ...templateData
      });

    if (error) throw error;

    toast.success("Template saved successfully");
    return true;
  } catch (error) {
    console.error('Error saving template:', error);
    toast.error("Failed to save template");
    return false;
  }
};

export const updateSectionContainers = (
  sections: Section[], 
  sectionId: string, 
  action: 'add' | 'update' | 'delete',
  containerId?: string,
  updates?: Partial<Container>
) => {
  return sections.map(section => {
    if (section.id !== sectionId) return section;

    switch (action) {
      case 'add':
        return {
          ...section,
          design: {
            ...section.design,
            containers: [
              ...(section.design.containers || []),
              {
                id: crypto.randomUUID(),
                columns: 1,
                columnWidths: [1],
                elements: []
              }
            ]
          }
        };
      case 'update':
        if (!containerId || !updates) return section;
        return {
          ...section,
          design: {
            ...section.design,
            containers: section.design.containers.map(container =>
              container.id === containerId
                ? { ...container, ...updates }
                : container
            )
          }
        };
      case 'delete':
        if (!containerId) return section;
        return {
          ...section,
          design: {
            ...section.design,
            containers: section.design.containers.filter(container => 
              container.id !== containerId
            )
          }
        };
      default:
        return section;
    }
  });
};
