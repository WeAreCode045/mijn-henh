
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTemplateInfo(templateId: string | undefined) {
  const [templateInfo, setTemplateInfo] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const fetchTemplateInfo = async () => {
      const id = templateId || 'default';
      
      if (id !== 'default') {
        const { data } = await supabase
          .from('brochure_templates')
          .select('id, name')
          .eq('id', id)
          .single();
          
        if (data) {
          setTemplateInfo(data);
          return;
        }
      }
      
      setTemplateInfo({ id: 'default', name: 'Default Template' });
    };

    fetchTemplateInfo();
  }, [templateId]);

  return { templateInfo };
}
