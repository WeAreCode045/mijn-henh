
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperties } from "@/hooks/useProperties";
import { format } from "date-fns";
import { Building, Calendar, Check, FileEdit, PenLine, Home as HomeIcon, Sliders } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function PropertyQuickview() {
  const navigate = useNavigate();
  const { properties, isLoading, selectedProperty, setSelectedProperty } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(properties);

  // Filter properties based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter((property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  }, [searchTerm, properties]);

  // Set a default selected property if none is selected
  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    }
  }, [properties, selectedProperty, setSelectedProperty]);

  if (isLoading) {
    return (
      <Card className="h-full bg-primary-color text-white">
        <CardHeader>
          <CardTitle className="text-white">Property Quickview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full bg-white/20" />
          <Skeleton className="h-12 w-full bg-white/20" />
          <Skeleton className="h-24 w-full bg-white/20" />
        </CardContent>
      </Card>
    );
  }

  if (!selectedProperty) {
    return (
      <Card className="h-full bg-primary-color text-white">
        <CardHeader>
          <CardTitle className="text-white">Property Quickview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <Building className="h-12 w-12 text-white/60" />
            <p className="text-white/80">No properties found</p>
            <Button 
              variant="outline" 
              className="mt-2 border-white text-white hover:bg-white hover:text-primary-color"
              onClick={() => navigate('/properties/add')}
            >
              Add Property
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-primary-color text-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Property Quickview</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/properties/add')}
          >
            <PenLine className="h-4 w-4 mr-1" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Input 
              placeholder="Search properties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Select 
            value={selectedProperty?.id || ""} 
            onValueChange={(value) => {
              const property = properties.find(p => p.id === value);
              if (property) setSelectedProperty(property);
            }}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white w-[180px]">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {selectedProperty && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedProperty.title}</h3>
                <p className="text-sm text-white/80">{selectedProperty.address}</p>
              </div>
              <Badge 
                variant={selectedProperty.status === "active" ? "default" : "secondary"} 
                className="ml-auto"
              >
                {selectedProperty.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-1 text-white/60" />
                <span>{selectedProperty.bedrooms} beds</span>
              </div>
              <div className="flex items-center">
                <Sliders className="h-4 w-4 mr-1 text-white/60" />
                <span>{selectedProperty.bathrooms} baths</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-white/60" />
                <span>Listed: {selectedProperty.created_at ? format(new Date(selectedProperty.created_at), "MMM d, yyyy") : "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1 text-white/60" />
                <span>Price: ${Number(selectedProperty.price).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white text-white hover:bg-white hover:text-primary-color"
                onClick={() => navigate(`/properties/${selectedProperty.id}`)}
              >
                View Details
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white text-white hover:bg-white hover:text-primary-color"
                onClick={() => navigate(`/properties/${selectedProperty.id}/edit`)}
              >
                <FileEdit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
