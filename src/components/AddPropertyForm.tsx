import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PropertyFormData } from "@/types/property";
import { PropertyFormContent } from "./property/form/PropertyFormContent";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyFormSubmit } from "@/hooks/property-form/usePropertyFormSubmit";
import { supabase } from "@/integrations/supabase/client";

export function AddPropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData, setFormData } = usePropertyForm(id);
  const { handleSubmit } = usePropertyFormSubmit();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id && !formData) {
      // Fetch property data if ID is present but form data is not yet loaded
      // This assumes usePropertyForm hook handles fetching data based on ID
    }
  }, [id, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: checked
    }));
  };

  const handleAddFeature = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      features: [
        ...prevFormData.features,
        {
          id: crypto.randomUUID(),
          description: `Feature ${prevFormData.features.length + 1}`
        }
      ]
    }));
  };

  const handleRemoveFeature = (id: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      features: prevFormData.features.filter(feature => feature.id !== id)
    }));
  };

  const handleUpdateFeature = (id: string, description: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      features: prevFormData.features.map(feature =>
        feature.id === id ? { ...feature, description } : feature
      )
    }));
  };

  const handleAddArea = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      areas: [
        ...prevFormData.areas,
        {
          id: crypto.randomUUID(),
          title: `Area ${prevFormData.areas.length + 1}`,
          description: "",
          imageIds: [],
          columns: 2,
          name: "",
          size: "",
          images: []
        }
      ]
    }));
  };

  const handleRemoveArea = (id: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      areas: prevFormData.areas.filter(area => area.id !== id)
    }));
  };

  const handleUpdateArea = (id: string, field: keyof PropertyFormData, value: any) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      areas: prevFormData.areas.map(area =>
        area.id === id ? { ...area, [field]: value } : area
      )
    }));
  };

  const handleAreaImageUpload = (areaId: string, files: FileList) => {
    // Placeholder for area image upload logic
    console.log(`Uploading images for area ${areaId}`, files);
  };

  const handleAreaImageRemove = (areaId: string, imageId: string) => {
    // Placeholder for area image removal logic
    console.log(`Removing image ${imageId} from area ${areaId}`);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const files = Array.from(e.target.files);

    try {
      // Upload each file to Supabase storage
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `properties/${id ? id : 'temp'}/${crypto.randomUUID()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Error",
            description: "Failed to upload image",
            variant: "destructive",
          });
          continue; // Skip to the next file
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Could not get public URL');
          continue;
        }

        // Update form data with new image URL
        setFormData(prevFormData => ({
          ...prevFormData,
          images: [...prevFormData.images, publicUrlData.publicUrl]
        }));
      }

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error('Error in image upload:', error);
      toast({
        title: "Error",
        description: "Error uploading images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAreaPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Placeholder for area photos upload logic
    console.log('Uploading area photos', e.target.files);
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prevFormData => {
      const updatedImages = [...prevFormData.images];
      updatedImages.splice(index, 1);
      return { ...prevFormData, images: updatedImages };
    });
  };

  const handleRemoveAreaPhoto = (areaId: string, imageId: string) => {
    // Placeholder for area photo removal logic
    console.log(`Removing area photo ${imageId} from area ${areaId}`);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    try {
      await handleSubmit(e, formData);
      toast({
        title: "Success",
        description: "Property saved successfully",
      });
      navigate('/properties');
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      navigate('/properties');
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit Property" : "Add New Property"}</h1>

      <form onSubmit={handleSubmitForm} className="space-y-4">
        <PropertyFormContent
          step={currentStep}
          formData={formData}
          onFieldChange={handleInputChange}
          onAddFeature={handleAddFeature}
          onRemoveFeature={handleRemoveFeature}
          onUpdateFeature={handleUpdateFeature}
          onAddArea={handleAddArea}
          onRemoveArea={handleRemoveArea}
          onUpdateArea={handleUpdateArea}
          onAreaImageUpload={handleAreaImageUpload}
          onAreaImageRemove={handleAreaImageRemove}
          handleImageUpload={handleImageUpload}
          handleAreaPhotosUpload={handleAreaPhotosUpload}
          handleRemoveImage={handleRemoveImage}
          handleRemoveAreaPhoto={handleRemoveAreaPhoto}
          handleFloorplanUpload={() => {}}
          handleRemoveFloorplan={() => {}}
          isUploading={isUploading}
        />

        <div className="flex justify-between">
          <Button
            variant="destructive"
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Property
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
