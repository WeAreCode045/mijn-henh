
import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code } from "@/components/ui/code";
import { Search, ChevronRight, Pencil, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";
import { PropertyData, PropertyNearbyPlace, PropertyCity } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { useAgencySettings } from "@/hooks/useAgencySettings";

export function PropertyQuickview() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyObjectId, setPropertyObjectId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  const { toast } = useToast();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { settings } = useAgencySettings();
  
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select('id, title, status, price, address, bedrooms, bathrooms, sqft, object_id')
          .eq('archived', false)
          .order('title');
          
        if (debouncedSearchTerm) {
          query = query.ilike('title', `%${debouncedSearchTerm}%`);
        }
        
        query = query.limit(10);
        
        const { data, error } = await query;
        
        if (error) throw error;
        if (data) {
          const formattedProperties = data.map(property => ({
            id: property.id,
            title: property.title || "",
            status: property.status || "Draft",
            price: property.price || "",
            address: property.address || "",
            bedrooms: property.bedrooms || "",
            bathrooms: property.bathrooms || "",
            sqft: property.sqft || "",
            object_id: property.object_id || "",
            features: [],
            images: [],
            areas: [],
            livingArea: "",
            buildYear: "",
            garages: "",
            energyLabel: "",
            hasGarden: false,
            description: "",
            shortDescription: "",
            location_description: "",
            map_image: null,
            latitude: null,
            longitude: null,
            nearby_places: [] as PropertyNearbyPlace[],
            nearby_cities: [] as PropertyCity[],
            floorplans: [],
            virtualTourUrl: "",
            youtubeUrl: "",
            notes: "",
            featuredImage: null,
            featuredImages: []
          })) as PropertyData[];
          
          setProperties(formattedProperties);
          
          if (!selectedPropertyId && data.length > 0) {
            setSelectedPropertyId(data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [debouncedSearchTerm, selectedPropertyId]);
  
  useEffect(() => {
    if (!selectedPropertyId) return;
    
    const fetchPropertyDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*, property_images(*)')
          .eq('id', selectedPropertyId)
          .single();
          
        if (error) throw error;
        if (data) {
          let nearbyPlaces: PropertyNearbyPlace[] = [];
          let nearbyCities: PropertyCity[] = [];
          
          if (data.nearby_places) {
            try {
              nearbyPlaces = Array.isArray(data.nearby_places) 
                ? data.nearby_places 
                : (typeof data.nearby_places === 'string' 
                  ? JSON.parse(data.nearby_places) 
                  : []);
            } catch (e) {
              console.error("Error parsing nearby_places:", e);
              nearbyPlaces = [];
            }
          }
          
          if (data.nearby_cities) {
            try {
              nearbyCities = Array.isArray(data.nearby_cities) 
                ? data.nearby_cities 
                : (typeof data.nearby_cities === 'string' 
                  ? JSON.parse(data.nearby_cities) 
                  : []);
            } catch (e) {
              console.error("Error parsing nearby_cities:", e);
              nearbyCities = [];
            }
          }
          
          setSelectedProperty({
            id: data.id,
            title: data.title || "",
            status: data.status || "Draft",
            price: data.price || "",
            address: data.address || "",
            bedrooms: data.bedrooms || "",
            bathrooms: data.bathrooms || "",
            sqft: data.sqft || "",
            features: [],
            images: (data.property_images || []),
            areas: [],
            object_id: data.object_id || "",
            created_at: data.created_at,
            updated_at: data.updated_at,
            livingArea: data.livingArea || "",
            buildYear: data.buildYear || "",
            garages: data.garages || "",
            energyLabel: data.energyLabel || "",
            hasGarden: data.hasGarden || false,
            description: data.description || "",
            shortDescription: data.shortDescription || "",
            location_description: data.location_description || "",
            map_image: data.map_image || null,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            nearby_places: nearbyPlaces,
            nearby_cities: nearbyCities,
            agent_id: data.agent_id || "",
            template_id: "",
            virtualTourUrl: data.virtualTourUrl || "",
            youtubeUrl: data.youtubeUrl || "",
            notes: data.notes || "",
            floorplans: [],
            floorplanEmbedScript: data.floorplanEmbedScript || "",
            featuredImage: null,
            featuredImages: [],
            propertyType: data.propertyType || ""
          });
          
          setPropertyTitle(data.title || "");
          setPropertyAddress(data.address || "");
          setPropertyObjectId(data.object_id || "");
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };
    
    fetchPropertyDetails();
  }, [selectedPropertyId]);
  
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
  
  const handlePropertySelect = (propertyId: string) => {
    if (propertyId === "select-property") return;
    setSelectedPropertyId(propertyId);
  };
  
  const navigateToProperty = () => {
    if (selectedPropertyId) {
      navigate(`/property/${selectedPropertyId}`);
    }
  };

  const handleToggleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(!isEditing);
  };
  
  const handleSaveDetails = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedPropertyId) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: propertyTitle,
          address: propertyAddress,
          object_id: propertyObjectId
        })
        .eq('id', selectedPropertyId);
        
      if (error) throw error;
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Property details updated successfully",
      });
      
      if (selectedProperty) {
        setSelectedProperty({
          ...selectedProperty,
          title: propertyTitle,
          address: propertyAddress,
          object_id: propertyObjectId
        });
      }
    } catch (error) {
      console.error("Error saving property details:", error);
      toast({
        title: "Error",
        description: "Failed to update property details",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getMainImageUrl = (property: PropertyData | null): string | null => {
    if (!property) return null;
    
    if (property.images && property.images.length > 0) {
      const mainImage = property.images.find(img => img.is_main || img.is_featured_image);
      if (mainImage && mainImage.url) return mainImage.url;
      
      if (typeof property.images[0] === 'string') {
        return property.images[0];
      } else if (typeof property.images[0] === 'object' && 'url' in property.images[0]) {
        return property.images[0].url;
      }
    }
    
    return null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const safeSelectedPropertyId = selectedPropertyId || "select-property";
  
  const apiEndpoint = selectedPropertyId 
    ? `${window.location.origin}/api/properties/${selectedPropertyId}` 
    : "No property selected";
  
  return (
    <Card className="h-full bg-primary">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-white">
          <span>Property Quickview</span>
          <div className="flex items-center gap-2">
            {selectedPropertyId && !isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm flex items-center gap-1 text-white hover:bg-primary-foreground/10"
                onClick={navigateToProperty}
              >
                View Property <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            {selectedPropertyId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleEdit}
                type="button"
                className="text-white hover:bg-primary-foreground/10"
              >
                <Pencil className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search properties..."
              className="pl-8 bg-white text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={safeSelectedPropertyId} 
            onValueChange={handlePropertySelect}
            defaultValue="select-property"
          >
            <SelectTrigger className="w-[220px] bg-white text-black">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select-property" disabled>Select a property</SelectItem>
              {properties.map((property) => (
                <SelectItem 
                  key={property.id} 
                  value={property.id || `property_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`}
                >
                  {property.title || `Property ID ${property.id.substring(0, 8)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedProperty ? (
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="property-title" className="text-white">Title</Label>
                  <Input
                    id="property-title"
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    className="mt-1 bg-white text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="property-address" className="text-white">Address</Label>
                  <Input
                    id="property-address"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="mt-1 bg-white text-black"
                    ref={addressInputRef}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="object-id" className="text-white">Object ID</Label>
                  <Input
                    id="object-id"
                    value={propertyObjectId}
                    onChange={(e) => setPropertyObjectId(e.target.value)}
                    placeholder="Enter object ID"
                    className="sm:flex-1 bg-white text-black"
                  />
                </div>
                <Button onClick={handleSaveDetails} disabled={isUpdating} type="button" 
                  className="bg-white text-primary hover:bg-white/90">
                  {isUpdating ? "Saving..." : "Save Details"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedProperty.title}</h3>
                    <p className="text-white/80">{selectedProperty.address || "No address specified"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">ID:</span>
                    <p className="text-sm font-mono break-all">{selectedProperty.id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Object ID:</span>
                    <p className="text-sm break-all">{selectedProperty.object_id || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">API Endpoint:</span>
                    <Code className="text-xs mt-1 overflow-x-auto w-full block bg-primary-foreground/10 text-white">{apiEndpoint}</Code>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium">Created:</span>
                      <p className="text-sm">{formatDate(selectedProperty.created_at)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Last Modified:</span>
                      <p className="text-sm">{formatDate(selectedProperty.updated_at)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  {getMainImageUrl(selectedProperty) ? (
                    <img 
                      src={getMainImageUrl(selectedProperty)} 
                      alt={selectedProperty.title} 
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-40 bg-primary-foreground/20 flex items-center justify-center rounded-md">
                      <p className="text-white/80 text-sm">No image available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-white/80">
            {isLoading ? 'Loading property details...' : 'Select a property to view details'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
