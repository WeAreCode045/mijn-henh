
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Card } from "@/components/ui/card";
import { useProperties } from "@/hooks/useProperties";
import { PropertyData } from "@/types/property";

export function PropertiesTabContent() {
  const { properties, isLoading, handleDelete } = useProperties();

  return (
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Properties</h2>
        <Button asChild>
          <Link to="/property/new">
            <Plus className="h-4 w-4 mr-1" />
            Add New Property
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-muted"></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                ...property,
                price: property.price || "",
                bedrooms: "",
                bathrooms: "",
                sqft: "",
                livingArea: "",
                buildYear: "",
                garages: "",
                energyLabel: "",
                hasGarden: false,
                description: "",
                location_description: "",
                features: [],
                areas: [],
                images: [],
                map_image: null,
                latitude: null,
                longitude: null
              } as PropertyData}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </CardContent>
  );
}
