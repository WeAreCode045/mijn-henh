import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code } from "@/components/ui/code";
import { Save, Pencil } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PropertyImage } from "../../../dashboard/components/PropertyImage";
import { supabase } from "@/integrations/supabase/client";
import { useAgencySettings } from "@/hooks/useAgencySettings";

interface PropertyDetailsCardProps {
  id: string;
  objectId?: string;
  title: string;
  apiEndpoint: string;
  createdAt?: string;
  updatedAt?: string;
  onSaveObjectId: (objectId: string) => Promise<void>;
  isUpdating: boolean;
  formattedCreateDate: string;
  formattedUpdateDate: string;
  property: {
    id: string;
    title: string;
  };
}

export function PropertyDetailsCard({
  id,
  objectId,
  title,
  apiEndpoint,
  onSaveObjectId,
  isUpdating,
  formattedCreateDate,
  formattedUpdateDate,
  property
}: PropertyDetailsCardProps) {
  const [currentObjectId, setCurrentObjectId] = useState(objectId || "");
  const [isEditing, setIsEditing] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState(title);
  const [propertyAddress, setPropertyAddress] = useState("");
  const isMobile = useIsMobile();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { settings } = useAgencySettings();
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('address')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        setPropertyAddress(data.address || "");
      }
    };
    
    fetchPropertyDetails();
  }, [id]);
  
  useEffect(() => {
    if (!isEditing || !addressInputRef.current) return;
    
    const googleApiKey = settings?.googleMapsApiKey;
    if (!googleApiKey) return;

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
      if (!(window as any).google || 
          !(window as any).google?.maps || 
          !(window as any).google?.maps?.places) {
        console.error('Google Maps Places API not loaded');
        return;
      }

      const autocomplete = new (window as any).google.maps.places.Autocomplete(
        addressInputRef.current as HTMLInputElement,
        { types: ['address'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setPropertyAddress(place.formatted_address);
        }
      });
    };

    loadGoogleMapsScript();
  }, [settings, isEditing]);
  
  const handleToggleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(!isEditing);
  };
  
  const handleSaveDetails = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: propertyTitle,
          address: propertyAddress,
          object_id: currentObjectId
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setIsEditing(false);
      if (currentObjectId !== objectId) {
        await onSaveObjectId(currentObjectId);
      }
    } catch (error) {
      console.error("Error saving property details:", error);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle>Property Details</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleEdit}
          type="button"
        >
          <Pencil className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="property-title">Title</Label>
                  <Input
                    id="property-title"
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="property-address">Address</Label>
                  <Input
                    id="property-address"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="mt-1"
                    ref={addressInputRef}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="object-id">Object ID</Label>
                  <Input
                    id="object-id"
                    value={currentObjectId}
                    onChange={(e) => setCurrentObjectId(e.target.value)}
                    placeholder="Enter object ID"
                    className="sm:flex-1"
                  />
                </div>
                <Button onClick={handleSaveDetails} disabled={isUpdating} type="button">
                  {isUpdating ? "Saving..." : "Save Details"}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold">{propertyTitle}</h3>
                  <p className="text-muted-foreground">{propertyAddress || "No address specified"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">ID:</span>
                  <p className="text-sm font-mono break-all">{id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Object ID:</span>
                  <p className="text-sm break-all">{currentObjectId || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">API Endpoint:</span>
                  <Code className="text-xs mt-1 overflow-x-auto w-full block">{apiEndpoint}</Code>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm font-medium">Created:</span>
                    <p className="text-sm">{formattedCreateDate}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Last Modified:</span>
                    <p className="text-sm">{formattedUpdateDate}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div>
            <PropertyImage property={{id: property.id, title: property.title}} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
