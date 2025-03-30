
import React, { useState, useEffect } from 'react';
import { PropertyArea } from '@/types/property';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';

interface AreaItemProps {
  area: PropertyArea;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onImageSelect?: (id: string) => void;
  onImageUpload?: (id: string, files: FileList) => void;
}

export function AreaItem({
  area,
  onRemove,
  onUpdate,
  onImageSelect,
  onImageUpload
}: AreaItemProps) {
  // Local state to manage form values
  const [localValues, setLocalValues] = useState({
    title: area.title || '',
    name: area.name || '',
    description: area.description || '',
    size: area.size || ''
  });
  
  // Update local state when area props change
  useEffect(() => {
    setLocalValues({
      title: area.title || '',
      name: area.name || '',
      description: area.description || '',
      size: area.size || ''
    });
  }, [area.id]); // Only update when area id changes to avoid constant updates
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle blur to save changes
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate(area.id, name, value);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium">{localValues.title || 'Untitled Area'}</h3>
        <Button variant="ghost" size="sm" onClick={() => onRemove(area.id)}>
          <TrashIcon className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Title</label>
          <Input 
            name="title"
            value={localValues.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Living Room"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Name</label>
          <Input 
            name="name"
            value={localValues.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Main Living Area"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Size</label>
          <Input 
            name="size"
            value={localValues.size}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 20m²"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Description</label>
          <Textarea 
            name="description"
            value={localValues.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe this area"
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
}
