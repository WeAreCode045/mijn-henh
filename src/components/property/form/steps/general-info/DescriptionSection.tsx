
import { PropertyFormData } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function DescriptionSection({ formData, onFieldChange, setPendingChanges }: DescriptionSectionProps) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const saveToDatabase = async (field: keyof PropertyFormData, value: any) => {
    if (!formData.id) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ [field]: value })
        .eq('id', formData.id);
        
      if (error) throw error;
      
      // Show success notification
      toast({
        title: "Saved",
        description: `${field} updated successfully`,
      });
    } catch (error) {
      console.error(`Error saving ${field} to database:`, error);
      toast({
        title: "Error",
        description: `Failed to save ${field}`,
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFieldChange(name as keyof PropertyFormData, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set a new timeout to save after 2 seconds
    saveTimeoutRef.current = setTimeout(async () => {
      await saveToDatabase(name as keyof PropertyFormData, value);
      
      if (setPendingChanges) {
        setPendingChanges(false);
      }
    }, 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            placeholder="Enter a brief summary of the property (displayed in listings)"
            value={formData.shortDescription || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter a detailed description of the property"
            value={formData.description || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className="min-h-[200px]"
            rows={8}
          />
        </div>
      </CardContent>
    </Card>
  );
}
