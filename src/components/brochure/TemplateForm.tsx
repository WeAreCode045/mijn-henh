
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Template } from './types/templateTypes';

interface TemplateFormProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onSave: () => void;
  template: Template | null;
}

export function TemplateForm({
  templateName,
  setTemplateName,
  description,
  setDescription,
  onSave,
  template
}: TemplateFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="templateName">Template Name</Label>
        <Input
          id="templateName"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Enter template name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter template description"
        />
      </div>
      <Button onClick={onSave} className="w-full mt-4">
        {template ? 'Update Template' : 'Save Template'}
      </Button>
    </div>
  );
}
