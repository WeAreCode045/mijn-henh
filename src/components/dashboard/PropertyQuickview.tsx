import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";
import { PropertyData, PropertyFeature, PropertyImage } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function PropertyQuickview() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  
  // Fetch properties based on search term
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select('id, title, status, price, address, bedrooms, bathrooms, sqft')
          .eq('archived', false)
          .order('title');
          
        // If there's a search term, filter by title
        if (debouncedSearchTerm) {
          query = query.ilike('title', `%${debouncedSearchTerm}%`);
        }
        
        // Limit results
        query = query.limit(10);
        
        const { data, error } = await query;
        
        if (error) throw error;
        if (data) {
          // Transform the data to match the PropertyData interface
          const formattedProperties = data.map(property => ({
            id: property.id,
            title: property.title || "",
            status: property.status || "Draft",
            price: property.price || "",
            address: property.address || "",
            bedrooms: property.bedrooms || "",
            bathrooms: property.bathrooms || "",
            sqft: property.sqft || "",
            features: [] as PropertyFeature[], // Add empty array for required features field
            images: [] as PropertyImage[], // Add empty array for required images field
            areas: [], // Add empty array for required areas field
            livingArea: "", // Add the required fields
            buildYear: "",
            garages: "",
            energyLabel: "",
            hasGarden: false,
            description: "",
            location_description: ""
          })) as PropertyData[];
          
          setProperties(formattedProperties);
          
          // If no property is selected yet, select the first one
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
  
  // Fetch selected property details
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
          // Helper function to safely parse features
          const safeParseFeatures = (features: unknown): PropertyFeature[] => {
            if (!features) return [];
            if (Array.isArray(features)) {
              return features.map(feature => ({
                id: typeof feature.id === 'string' ? feature.id : String(Date.now()),
                description: typeof feature.description === 'string' ? feature.description : ''
              }));
            }
            return [];
          };
          
          // Transform the data to match the PropertyData interface
          const propertyData: PropertyData = {
            id: data.id,
            title: data.title || "",
            status: data.status || "Draft",
            price: data.price || "",
            address: data.address || "",
            bedrooms: data.bedrooms || "",
            bathrooms: data.bathrooms || "",
            sqft: data.sqft || "",
            description: data.description || "",
            location_description: data.location_description || "",
            features: safeParseFeatures(data.features),
            images: (data.property_images || []) as PropertyImage[],
            areas: [], // Adding required empty areas array
            agent_id: data.agent_id || undefined,
            object_id: data.object_id || undefined,
            metadata: typeof data.metadata === 'object' && data.metadata !== null && !Array.isArray(data.metadata) 
              ? { status: data.status || "Draft", ...data.metadata as Record<string, unknown> }
              : { status: data.status || "Draft" },
            archived: data.archived || false,
            livingArea: data.livingArea || "",
            buildYear: data.buildYear || "",
            garages: data.garages || "",
            energyLabel: data.energyLabel || "",
            hasGarden: data.hasGarden || false
          };
          
          setSelectedProperty(propertyData);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };
    
    fetchPropertyDetails();
  }, [selectedPropertyId]);
  
  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };
  
  const navigateToProperty = () => {
    if (selectedPropertyId) {
      navigate(`/property/${selectedPropertyId}`);
    }
  };

  // Function to get the main image URL if available
  const getMainImageUrl = (property: PropertyData | null): string | null => {
    if (!property) return null;
    
    // Check if property has images
    if (property.images && property.images.length > 0) {
      // Try to find a main or featured image first
      const mainImage = property.images.find(img => img.is_main || img.is_featured_image);
      if (mainImage && mainImage.url) return mainImage.url;
      
      // Otherwise, return the first image
      if (typeof property.images[0] === 'string') {
        return property.images[0];
      } else if (typeof property.images[0] === 'object' && 'url' in property.images[0]) {
        return property.images[0].url;
      }
    }
    
    // Return null if no images are found
    return null;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Property Quickview</span>
          {selectedPropertyId && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm flex items-center gap-1"
              onClick={navigateToProperty}
            >
              View Property <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Property Selector */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select 
              value={selectedPropertyId || "select-property"} 
              onValueChange={handlePropertySelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-property" disabled>Select a property</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Property Details */}
          <div className="md:col-span-3">
            {selectedProperty ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="text-xl font-semibold">{selectedProperty.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                      {selectedProperty.status || 'Draft'}
                    </span>
                    <span className="font-medium">{selectedProperty.price || 'Price not set'}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground">{selectedProperty.address || 'No address'}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-2 bg-muted rounded-md">
                    <div className="text-lg font-medium">{selectedProperty.bedrooms || '0'}</div>
                    <div className="text-xs text-muted-foreground">Beds</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-md">
                    <div className="text-lg font-medium">{selectedProperty.bathrooms || '0'}</div>
                    <div className="text-xs text-muted-foreground">Baths</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-md">
                    <div className="text-lg font-medium">{selectedProperty.sqft || '0'}</div>
                    <div className="text-xs text-muted-foreground">m²</div>
                  </div>
                </div>
                
                {getMainImageUrl(selectedProperty) && (
                  <img 
                    src={getMainImageUrl(selectedProperty)} 
                    alt={selectedProperty.title} 
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                {isLoading ? 'Loading property details...' : 'Select a property to view details'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
