
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Template, Section } from "@/components/brochure/types/templateTypes";
import { FileType } from "lucide-react";
import { useState, useEffect } from "react";

interface PropertyTemplateSelectorProps {
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

export function PropertyTemplateSelector({ 
  selectedTemplateId, 
  onTemplateChange 
}: PropertyTemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);

  // Fetch templates when component mounts
  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('*');
      
      if (!error && data) {
        // Transform the data to match the Template type
        const transformedTemplates = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          sections: item.sections as unknown as Section[], // Cast sections to Section[] type
          created_at: item.created_at
        }));
        
        setTemplates(transformedTemplates);
      }
    };
    
    fetchTemplates();
  }, []);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileType className="h-5 w-5" />
          Brochure Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedTemplateId}
          onValueChange={onTemplateChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Template</SelectItem>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-2">
          Select a template to use when generating the PDF brochure
        </p>
      </CardContent>
    </Card>
  );
}
