
import { useState } from 'react';
import { PropertyFormData, PropertyImage } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyCoverImages(
  formData: PropertyFormData,
  setFormState: (data: PropertyFormData) => void
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Normalize an image which might be a string or PropertyImage object
  const normalizeImage = (img: string | PropertyImage): PropertyImage => {
    if (typeof img === 'string') {
      return {
        id: `img-${Date.now()}-${Math.random()}`,
        url: img,
        type: 'image',
      };
    }
    return img;
  };
  
  // Set the featured (main) image
  const handleSetFeaturedImage = async (url: string | null) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    
    try {
      // If there's an existing featuredImage, reset its is_main flag
      if (formData.featuredImage) {
        const { error: resetError } = await supabase
          .from('property_images')
          .update({ is_main: false })
          .eq('property_id', formData.id)
          .eq('is_main', true);
          
        if (resetError) throw resetError;
      }
      
      // If a new featured image is specified, set it
      if (url) {
        const { error } = await supabase
          .from('property_images')
          .update({ is_main: true })
          .eq('property_id', formData.id)
          .eq('url', url);
          
        if (error) throw error;
      }
      
      // Update local state
      setFormState({
        ...formData,
        featuredImage: url
      });
      
      toast({
        title: url ? "Featured image updated" : "Featured image removed",
      });
    } catch (error) {
      console.error('Error updating featured image:', error);
      toast({
        title: "Error",
        description: "Failed to update featured image",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Toggle an image in the featuredImages list (grid images)
  const handleToggleFeaturedImage = async (url: string) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    
    try {
      const featuredImages = formData.featuredImages || [];
      const isAlreadyFeatured = featuredImages.includes(url);
      
      // Find image ID from URL
      let imageId: string | null = null;
      
      if (formData.images) {
        const matchingImage = formData.images.find(img => {
          const imgObj = normalizeImage(img);
          return imgObj.url === url;
        });
        
        if (matchingImage) {
          imageId = normalizeImage(matchingImage).id;
        }
      }
      
      if (!imageId) {
        console.error('Could not find image ID for URL:', url);
        throw new Error('Image not found');
      }
      
      // Update in database
      const { error } = await supabase
        .from('property_images')
        .update({ is_featured_image: !isAlreadyFeatured })
        .eq('property_id', formData.id)
        .eq('id', imageId);
        
      if (error) throw error;
      
      // Update local state
      let newFeaturedImages: string[];
      
      if (isAlreadyFeatured) {
        newFeaturedImages = featuredImages.filter(image => image !== url);
      } else {
        newFeaturedImages = [...featuredImages, url];
      }
      
      // Ensure coverImages is updated to match
      const coverImages: PropertyImage[] = newFeaturedImages.map(imgUrl => ({
        id: `cover-${Date.now()}-${Math.random()}`,
        url: imgUrl,
        type: 'image'
      }));
      
      setFormState({
        ...formData,
        featuredImages: newFeaturedImages,
        coverImages
      });
      
      toast({
        title: isAlreadyFeatured ? "Image removed from grid" : "Image added to grid",
      });
    } catch (error) {
      console.error('Error toggling featured image:', error);
      toast({
        title: "Error",
        description: "Failed to update grid images",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    isUpdating
  };
}
