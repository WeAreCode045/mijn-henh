
import { useNavigate, useParams } from "react-router-dom";
import { EditPropertyForm } from "@/components/EditPropertyForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export default function EditPropertyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
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

      if (!id) {
        throw new Error('Property ID is required');
      }

      const { error } = await supabase
        .from('properties')
        .update(submitData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property updated successfully",
        variant: "default"
      });
      navigate('/properties');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      <EditPropertyForm onSubmit={handleSubmit} />
    </div>
  );
}
