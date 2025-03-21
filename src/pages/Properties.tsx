
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Properties() {
  const navigate = useNavigate();
  const { properties, isLoading, handleDelete, refetch } = useProperties();
  const { toast } = useToast();

  const handleCreateNewProperty = async () => {
    try {
      // Create a new empty property record first to get an ID
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: 'New Property',
          status: 'Draft'
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data && data.id) {
        // Navigate to the property form with the new ID
        navigate(`/property/${data.id}`);
      }
    } catch (error) {
      console.error("Error creating new property:", error);
      toast({
        title: "Error",
        description: "Failed to create new property",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-estate-800">Woning Brochures</h1>
          <Button onClick={handleCreateNewProperty}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nieuwe Brochure
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: PropertyData) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
