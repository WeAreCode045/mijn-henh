
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save } from "lucide-react";
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PropertyTitleEditorProps {
  property: PropertyData;
  onSave: () => void;
}

export function PropertyTitleEditor({ property, onSave }: PropertyTitleEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(property.title);
  const [address, setAddress] = useState(property.address);
  const [isSaving, setIsSaving] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset values if cancelling edit
    if (isEditing) {
      setTitle(property.title);
      setAddress(property.address);
    } else {
      // Focus the address input when entering edit mode
      setTimeout(() => {
        if (addressInputRef.current) {
          addressInputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('properties')
        .update({
          title,
          address
        })
        .eq('id', property.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property details updated",
      });

      setIsEditing(false);
      onSave(); // Refresh data
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to update property details",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        {isEditing ? (
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Property Title"
              className="text-xl font-semibold mb-2"
            />
          </div>
        ) : (
          <h3 className="text-xl font-semibold">{title || "Untitled Property"}</h3>
        )}
        
        {!isEditing ? (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={toggleEditMode}
            title="Edit Property Information"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleSave}
            disabled={isSaving}
            title="Save Property Information"
          >
            <Save className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <label className="text-sm font-medium mb-1 block">Address</label>
          <Input 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Property Address"
            ref={addressInputRef}
          />
        </div>
      ) : (
        <p className="text-muted-foreground">{address || "No address specified"}</p>
      )}
    </div>
  );
}
