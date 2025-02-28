
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
}

interface TemplateSectionProps {
  templateId: string;
  onSave: (templateId: string) => void;
  isUpdating: boolean;
}

export function TemplateSection({ 
  templateId, 
  onSave, 
  isUpdating 
}: TemplateSectionProps) {
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    // Fetch templates
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('id, name');
      
      if (!error && data) {
        setTemplates(data);
      }
    };
    
    fetchTemplates();
  }, []);

  const handleSave = () => {
    onSave(currentTemplateId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Brochure Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-select">Select Template</Label>
          <Select 
            value={currentTemplateId} 
            onValueChange={setCurrentTemplateId}
          >
            <SelectTrigger id="template-select">
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
        </div>
        
        <Button onClick={handleSave} disabled={isUpdating}>
          <Save className="h-4 w-4 mr-2" />
          {isUpdating ? "Saving..." : "Set Template"}
        </Button>
      </CardContent>
    </Card>
  );
}
