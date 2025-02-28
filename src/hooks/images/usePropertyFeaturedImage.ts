
import type { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyFeaturedImage(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();

  const handleSetFeaturedImage = (url: string) => {
    console.log("Setting featured image:", url);
    
    // Update the form data with the new featured image
    setFormData({
      ...formData,
      featuredImage: url
    });
    
    toast({
      title: "Success",
      description: "Featured image updated",
    });
  };

  const handleRemoveFeaturedImage = () => {
    console.log("Removing featured image");
    
    // Clear the featured image
    setFormData({
      ...formData,
      featuredImage: null
    });
    
    toast({
      title: "Success",
      description: "Featured image removed",
    });
  };

  const handleToggleGridImage = (url: string) => {
    console.log("Toggling grid image:", url);
    // Ensure gridImages is always an array
    const currentGridImages = Array.isArray(formData.gridImages) ? formData.gridImages : [];
    
    // If the image is already in the grid, remove it, otherwise add it
    const newGridImages = currentGridImages.includes(url)
      ? currentGridImages.filter(img => img !== url)
      : [...currentGridImages, url];
    
    // Limit to max 4 grid images
    const limitedGridImages = newGridImages.slice(0, 4);
    
    setFormData({
      ...formData,
      gridImages: limitedGridImages
    });
    
    const action = currentGridImages.includes(url) ? "removed from" : "added to";
    toast({
      title: "Success",
      description: `Image ${action} grid`,
    });
  };

  const isInGridImages = (url: string): boolean => {
    const gridImages = Array.isArray(formData.gridImages) ? formData.gridImages : [];
    return gridImages.includes(url);
  };

  const isFeaturedImage = (url: string): boolean => {
    return formData.featuredImage === url;
  };

  return {
    handleSetFeaturedImage,
    handleRemoveFeaturedImage,
    handleToggleGridImage,
    isInGridImages,
    isFeaturedImage
  };
}
