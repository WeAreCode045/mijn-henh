
import { useState, useEffect, useRef } from 'react';
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UsePropertyOverviewEditProps {
  property: PropertyData;
  settings: any;
}

export function usePropertyOverviewEdit({ property, settings }: UsePropertyOverviewEditProps) {
  const { toast } = useToast();
  
  const [title, setTitle] = useState(property.title || '');
  const [address, setAddress] = useState(property.address || '');
  const [price, setPrice] = useState(property.price || '');
  const [objectId, setObjectId] = useState(property.object_id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [agentName, setAgentName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Reference for Google Places Autocomplete
  const addressInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch agent name if agent_id exists
  useEffect(() => {
    const fetchAgentName = async () => {
      if (property.agent_id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', property.agent_id)
          .single();
        
        if (data && !error) {
          setAgentName(data.full_name || 'Unnamed Agent');
        }
      } else {
        setAgentName('');
      }
    };
    
    fetchAgentName();
  }, [property.agent_id]);
  
  // Set up Google Places Autocomplete for address field
  useEffect(() => {
    // Only set up when in edit mode
    if (!isEditing || !addressInputRef.current) return;
    
    const googleApiKey = settings?.googleMapsApiKey;
    if (!googleApiKey) return;

    // Load the Google Maps JavaScript API
    const loadGoogleMapsScript = () => {
      const scriptId = 'google-maps-script';
      if (document.getElementById(scriptId)) return;

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      // Use window with type assertion to access the google object
      if (!(window as GoogleMapsWindow).google || 
          !(window as GoogleMapsWindow).google?.maps || 
          !(window as GoogleMapsWindow).google?.maps?.places) {
        console.error('Google Maps Places API not loaded');
        return;
      }

      const autocomplete = new (window as GoogleMapsWindow).google!.maps!.places!.Autocomplete(
        addressInputRef.current as HTMLInputElement,
        { types: ['address'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setAddress(place.formatted_address);
        }
      });
    };

    loadGoogleMapsScript();
  }, [settings, isEditing]);
  
  const handleSaveAllFields = async () => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          title: title,
          address: address,
          price: price,
          object_id: objectId
        })
        .eq('id', property.id);
        
      if (error) throw error;
      
      toast({
        title: "Updated",
        description: "Property information updated successfully",
      });
      
      // Exit edit mode after saving
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating fields:", error);
      toast({
        title: "Error",
        description: "Could not update property information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle edit mode for all fields
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return {
    title,
    setTitle,
    address,
    setAddress,
    price,
    setPrice,
    objectId,
    setObjectId,
    isSaving,
    agentName,
    isEditing,
    addressInputRef,
    handleSaveAllFields,
    toggleEditMode
  };
}
