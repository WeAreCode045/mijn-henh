
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData, PropertyImage } from '@/types/property';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { toPropertyImage, getImageUrl } from '@/utils/imageTypeConverters';

// Define the submission type for this custom hook
export interface Submission {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  agentId: string | null;
  agent?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
  } | null;
  replies: SubmissionReply[];
}

export interface SubmissionReply {
  id: string;
  submissionId: string;
  replyText: string;
  createdAt: string;
  updatedAt: string;
  agentId: string | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  userAvatar: string | null;
}

export function usePropertyMainImages(
  formData: PropertyFormData,
  setFormData: Dispatch<SetStateAction<PropertyFormData>>
) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Set an image as the main image (previously featured image)
  const handleSetFeaturedImage = async (url: string | null) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    try {
      // First, unmark all images as main
      const { error: resetError } = await supabase
        .from('property_images')
        .update({ is_main: false })
        .eq('property_id', formData.id);
        
      if (resetError) {
        throw resetError;
      }
      
      if (url) {
        // Mark the selected image as main
        const { error: updateError } = await supabase
          .from('property_images')
          .update({ is_main: true })
          .eq('property_id', formData.id)
          .eq('url', url);
          
        if (updateError) {
          throw updateError;
        }
          
        // Update local state
        setFormData(prevState => ({
          ...prevState,
          featuredImage: url
        }));
        
        toast.success("Main image updated successfully.");
      } else {
        // If url is null, just clear the main image
        setFormData(prevState => ({
          ...prevState,
          featuredImage: null
        }));
      }
    } catch (error) {
      console.error("Error updating main image:", error);
      toast.error("Failed to update main image.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle whether an image is in the featured images collection
  const handleToggleFeaturedImage = async (image: PropertyImage | string) => {
    if (!formData.id) return;
    
    const imageUrl = typeof image === 'string' ? image : image.url;
    
    setIsUpdating(true);
    try {
      // Check if the image is already in the featured images
      const featuredImagesUrls = formData.featuredImages?.map(img => 
        typeof img === 'string' ? img : img.url
      ) || [];
      
      const isInFeatured = featuredImagesUrls.includes(imageUrl);
      
      if (!isInFeatured) {
        // Check if we already have 4 featured images
        const currentFeaturedImages = formData.featuredImages || [];
        if (currentFeaturedImages.length >= 4) {
          // Remove the oldest featured image
          const oldestFeaturedImage = currentFeaturedImages[0];
          const oldestUrl = typeof oldestFeaturedImage === 'string' ? 
            oldestFeaturedImage : oldestFeaturedImage.url;
          
          // Unmark it in the database
          const { error: resetError } = await supabase
            .from('property_images')
            .update({ is_featured_image: false })
            .eq('property_id', formData.id)
            .eq('url', oldestUrl);
            
          if (resetError) {
            throw resetError;
          }
        }
      }
      
      // Toggle the is_featured_image flag in the database
      const { error: updateError } = await supabase
        .from('property_images')
        .update({ is_featured_image: !isInFeatured })
        .eq('property_id', formData.id)
        .eq('url', imageUrl);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setFormData(prevState => {
        const currentFeaturedImages = prevState.featuredImages || [];
        const currentFeaturedUrls = currentFeaturedImages.map(img => 
          typeof img === 'string' ? img : img.url
        );
        
        let updatedFeaturedImages: PropertyImage[];
        
        if (isInFeatured) {
          // Remove from featured
          updatedFeaturedImages = currentFeaturedImages.filter(img => 
            getImageUrl(img) !== imageUrl
          );
        } else {
          // Add to featured, maintaining max 4 images
          const newImage = typeof image === 'string' ? toPropertyImage(image) : image;
          updatedFeaturedImages = [...currentFeaturedImages, newImage];
          if (updatedFeaturedImages.length > 4) {
            updatedFeaturedImages = updatedFeaturedImages.slice(1); // Remove oldest
          }
        }
        
        return {
          ...prevState,
          featuredImages: updatedFeaturedImages,
          // Update legacy fields for backward compatibility
          coverImages: updatedFeaturedImages
        };
      });
      
      toast.success(isInFeatured 
        ? "Image removed from featured images." 
        : "Image added to featured images.");
    } catch (error) {
      console.error("Error toggling featured image:", error);
      toast.error("Failed to update featured image.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle reply data safely
  const processReplyData = (reply: any): SubmissionReply => {
    // Safely extract user data, providing defaults for missing properties
    const userData = reply.user || {};
    
    return {
      id: reply.id,
      submissionId: reply.submission_id,
      replyText: reply.reply_text,
      createdAt: reply.created_at,
      updatedAt: reply.updated_at,
      agentId: reply.agent_id,
      userId: reply.user_id || null,
      userName: userData.full_name || "Unknown User",
      userEmail: userData.email || "no-email@example.com",
      userPhone: userData.phone || "N/A",
      userAvatar: userData.avatar_url || null
    };
  };

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    isUpdating,
    processReplyData
  };
}
