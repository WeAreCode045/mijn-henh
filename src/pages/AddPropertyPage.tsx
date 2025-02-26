
import { PropertyForm } from "@/components/PropertyForm";
import type { PropertyFormData } from "@/types/property";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (formData: PropertyFormData) => {
    try {
      const submitData = {
        ...formData,
        features: formData.features as unknown as Json,
        areas: formData.areas as unknown as Json[],
        nearby_places: formData.nearby_places as unknown as Json,
        images: formData.images.map(img => img.url)
      };

      const { error } = await supabase
        .from('properties')
        .insert(submitData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property created successfully",
        variant: "default"
      });
      navigate('/properties');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Property</h1>
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
}
