
import { useState, useEffect } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyFetch } from './property-form/usePropertyFetch';

export function usePropertyForm(propertyId?: string) {
  const { property, isLoading, error } = usePropertyFetch(propertyId);
  const [formData, setFormData] = useState<PropertyFormData | null>(null);

  useEffect(() => {
    if (property) {
      // Convert property to form data
      const initialFormData: PropertyFormData = {
        ...property,
        livingArea: property.livingArea || '',
        title: property.title || '',
        price: property.price || '',
        address: property.address || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        sqft: property.sqft || '',
        buildYear: property.buildYear || '',
        garages: property.garages || '',
        energyLabel: property.energyLabel || '',
        hasGarden: property.hasGarden || false,
        description: property.description || '',
        location_description: property.location_description || '',
        features: property.features || [],
        featuredImage: property.featuredImage || null,
        featuredImages: property.featuredImages || [],
        areas: property.areas || [],
        map_image: property.map_image || null,
        nearby_places: property.nearby_places || [],
        nearby_cities: property.nearby_cities || [],
        latitude: property.latitude || null,
        longitude: property.longitude || null,
        floorplanEmbedScript: property.floorplanEmbedScript || '',
        virtualTourUrl: property.virtualTourUrl || '',
        youtubeUrl: property.youtubeUrl || '',
        // Ensure these properties are defined
        images: property.images || [],
        areaPhotos: property.areaPhotos || [],
        coverImages: [],
        gridImages: [],
      };
      
      setFormData(initialFormData);
    } else if (!isLoading && !propertyId) {
      // Create empty form data for a new property
      const emptyFormData: PropertyFormData = {
        title: '',
        price: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        livingArea: '',
        buildYear: '',
        garages: '',
        energyLabel: '',
        hasGarden: false,
        description: '',
        location_description: '',
        features: [],
        images: [],
        featuredImage: null,
        featuredImages: [],
        areas: [],
        map_image: null,
        nearby_places: [],
        nearby_cities: [],
        latitude: null,
        longitude: null,
        floorplanEmbedScript: '',
        virtualTourUrl: '',
        youtubeUrl: '',
        areaPhotos: [],
        coverImages: [],
        gridImages: [],
      };
      
      setFormData(emptyFormData);
    }
  }, [property, isLoading, propertyId]);

  return { formData, setFormData, isLoading, error };
}
