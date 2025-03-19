
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';

interface GoogleAddressAutocompleteProps {
  onSelect?: (address: string) => void;
  apiKey: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
}

export function GoogleAddressAutocomplete({ 
  onSelect, 
  apiKey,
  value,
  onChange,
  ...props 
}: GoogleAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Skip if API key is not provided
    if (!apiKey) return;

    // Skip if Google API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsScriptLoaded(true);
      return;
    }

    // Inject Google Places API script if not already loaded
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    googleMapsScript.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(googleMapsScript);

    return () => {
      // Clean up script tag on unmount if it was added by this component
      if (document.head.contains(googleMapsScript)) {
        document.head.removeChild(googleMapsScript);
      }
    };
  }, [apiKey]);

  useEffect(() => {
    // Initialize autocomplete when script is loaded
    if (isScriptLoaded && inputRef.current && window.google?.maps?.places) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['address'] }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address && onSelect) {
          onSelect(place.formatted_address);
        }
      });
    }
  }, [isScriptLoaded, onSelect]);

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Enter address"
      {...props}
    />
  );
}
