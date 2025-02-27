
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PropertyFormData } from "@/types/property";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function DescriptionSection({ formData, onFieldChange }: DescriptionSectionProps) {
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000; // Maximum character limit
  
  useEffect(() => {
    setCharCount(formData.description?.length || 0);
  }, [formData.description]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onFieldChange('description', value);
    setCharCount(value.length);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="flex justify-between">
        <span>Property Description</span>
        <span className={`text-xs ${charCount > maxChars ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount}/{maxChars}
        </span>
      </Label>
      <Textarea
        id="description"
        value={formData.description || ''}
        onChange={handleChange}
        placeholder="Describe the property in detail..."
        className="min-h-[150px] resize-y"
      />
      {charCount > maxChars && (
        <p className="text-xs text-red-500">
          Description exceeds maximum character limit.
        </p>
      )}
    </div>
  );
}
