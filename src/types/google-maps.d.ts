
interface GoogleMapsPlace {
  formatted_address?: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface GoogleMapsAutocomplete {
  addListener: (event: string, callback: () => void) => void;
  getPlace: () => GoogleMapsPlace;
}

declare namespace google.maps.places {
  class Autocomplete {
    constructor(
      input: HTMLInputElement,
      options?: { types: string[] }
    );
    addListener: (event: string, callback: () => void) => void;
    getPlace: () => GoogleMapsPlace;
  }
}

interface GoogleMapsWindow extends Window {
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          input: HTMLInputElement,
          options?: { types: string[] }
        ) => GoogleMapsAutocomplete;
      };
    };
  };
}

declare global {
  interface Window extends GoogleMapsWindow {}
}
