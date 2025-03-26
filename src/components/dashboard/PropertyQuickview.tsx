
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyData } from "@/types/property";
import { PropertyOverviewCard } from "@/components/property/dashboard/PropertyOverviewCard";

export function PropertyQuickview() {
  const { properties, isLoading } = useProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter properties based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  }, [searchQuery, properties]);

  // Set initial selected property when properties load
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    }
  }, [properties, selectedProperty]);

  const handleSelectProperty = (property: PropertyData) => {
    setSelectedProperty(property);
    setShowDropdown(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Property Details</span>
        </CardTitle>
        
        <div className="relative">
          <div className="flex items-center border rounded-md overflow-hidden">
            <span className="pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </span>
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          
          {showDropdown && filteredProperties.length > 0 && (
            <div className="absolute z-10 w-full bg-background border rounded-md mt-1 shadow-lg max-h-64 overflow-y-auto">
              {filteredProperties.map(property => (
                <div
                  key={property.id}
                  className="p-2 hover:bg-accent cursor-pointer"
                  onClick={() => handleSelectProperty(property)}
                >
                  {property.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : selectedProperty ? (
          <PropertyOverviewCard property={selectedProperty} />
        ) : (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            No properties found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
