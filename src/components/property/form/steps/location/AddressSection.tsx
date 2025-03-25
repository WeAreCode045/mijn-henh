import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useToast } from "@/components/ui/use-toast";
import { useLocationCoordinates } from "@/hooks/location/useLocationCoordinates";

interface AddressSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationDescription?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  isLoadingLocationDescription?: boolean;
  isLoadingLocationData?: boolean;
}

export function AddressSection({
  formData,
  onFieldChange,
  onFetchLocationDescription,
  onFetchLocationData,
  isLoadingLocationDescription = false,
  isLoadingLocationData = false
}: AddressSectionProps) {
  const { settings } = useAgencySettings();
  const { toast } = useToast();
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [localAddress, setLocalAddress] = useState(formData.address || "");
  const [localLocationDescription, setLocalLocationDescription] = useState(formData.location_description || "");
  
  const { fetchLocationData } = useLocationCoordinates(
    formData, 
    onFieldChange || (() => {}), 
    setIsLoadingCoordinates, 
    toast
  );

  useEffect(() => {
    setLocalAddress(formData.address || "");
    setLocalLocationDescription(formData.location_description || "");
  }, [formData.address, formData.location_description]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'address') {
      setLocalAddress(value);
    } else if (name === 'location_description') {
      setLocalLocationDescription(value);
    }
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      if (onFieldChange) {
        onFieldChange(name as keyof PropertyFormData, value);
        
        if (name === 'address' && value && formData.id) {
          console.log("Auto-fetching coordinates for address:", value);
          fetchLocationData();
        }
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const googleApiKey = settings?.googleMapsApiKey;
    if (!googleApiKey || !autocompleteInputRef.current) return;

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
      if (!(window as GoogleMapsWindow).google || 
          !(window as GoogleMapsWindow).google?.maps || 
          !(window as GoogleMapsWindow).google?.maps?.places) {
        console.error('Google Maps Places API not loaded');
        return;
      }

      const autocomplete = new (window as GoogleMapsWindow).google!.maps!.places!.Autocomplete(
        autocompleteInputRef.current as HTMLInputElement,
        { types: ['address'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address && onFieldChange) {
          onFieldChange('address', place.formatted_address);
          
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            console.log("Got coordinates from Places API:", lat, lng);
            onFieldChange('latitude', lat);
            onFieldChange('longitude', lng);
          }
        }
      });
    };

    loadGoogleMapsScript();
  }, [settings, onFieldChange]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Property Address</Label>
            <div className="flex items-center gap-2">
              <Input
                id="address"
                name="address"
                value={localAddress}
                onChange={handleChange}
                placeholder="Enter full property address"
                className="flex-1"
                ref={autocompleteInputRef}
              />
              {onFetchLocationData && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onFetchLocationData}
                  disabled={isLoadingLocationData || !localAddress}
                  className="whitespace-nowrap"
                >
                  {isLoadingLocationData ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Fetch Location Data
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="location_description">Location Description</Label>
              {onFetchLocationDescription && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onFetchLocationDescription}
                  disabled={isLoadingLocationDescription || !localAddress}
                  className="flex gap-2 items-center"
                >
                  {isLoadingLocationDescription ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      Generate Description
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="location_description"
              name="location_description"
              value={localLocationDescription}
              onChange={handleChange}
              placeholder="Describe the property location and surroundings"
              rows={6}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
