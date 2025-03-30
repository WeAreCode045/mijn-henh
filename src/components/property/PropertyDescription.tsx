
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from "react";

interface PropertyDescriptionProps {
  description: string;
  location_description?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function PropertyDescription({
  description,
  location_description,
  onChange,
}: PropertyDescriptionProps) {
  // Use local state to maintain cursor position
  const [localDescription, setLocalDescription] = useState(description);
  const [localLocationDescription, setLocalLocationDescription] = useState(location_description || "");
  
  // Sync with props when they change externally
  useEffect(() => {
    setLocalDescription(description);
  }, [description]);
  
  useEffect(() => {
    setLocalLocationDescription(location_description || "");
  }, [location_description]);
  
  const handleLocalChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update local state immediately
    if (name === "description") {
      setLocalDescription(value);
    } else if (name === "location_description") {
      setLocalLocationDescription(value);
    }
    
    // Pass the change up to parent
    onChange(e);
  }, [onChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description">Beschrijving woning</Label>
        <Textarea
          id="description"
          name="description"
          value={localDescription}
          onChange={handleLocalChange}
          className="mt-1"
          placeholder="Voer hier een algemene beschrijving van de woning in..."
          required
        />
      </div>
      
      {location_description !== undefined && (
        <div>
          <Label htmlFor="location_description">Locatiebeschrijving</Label>
          <Textarea
            id="location_description"
            name="location_description"
            value={localLocationDescription}
            onChange={handleLocalChange}
            className="mt-1"
            placeholder="Beschrijving van de locatie..."
          />
        </div>
      )}
    </div>
  );
}
