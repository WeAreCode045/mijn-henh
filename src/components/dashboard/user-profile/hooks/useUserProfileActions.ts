
import { useState } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useUserProfileActions(
  onUpdateProfile?: (updatedUser: Partial<User>) => Promise<void>
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { toast } = useToast();

  const handleEditClick = async () => {
    console.log("handleEditClick - Opening profile edit dialog");
    setIsEditing(true);
  };

  const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
    try {
      setIsUploadingAvatar(true);
      console.log("Starting avatar upload for user:", userId);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = fileName;

      // Upload to agent-photos bucket
      const { error: uploadError } = await supabase.storage
        .from('agent-photos')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('agent-photos')
        .getPublicUrl(filePath);

      console.log("Avatar uploaded successfully:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, formData: any, avatarFile?: File) => {
    e.preventDefault();
    console.log("handleSubmit - Form data received:", formData);
    
    setIsUpdating(true);
    
    try {
      let avatarUrl = null;
      
      // Upload avatar if provided
      if (avatarFile && formData.user_id) {
        console.log("Uploading avatar file:", avatarFile.name);
        avatarUrl = await uploadAvatar(avatarFile, formData.user_id);
        if (!avatarUrl) {
          throw new Error("Failed to upload avatar");
        }
      }

      // Update employer_profiles table using user_id
      const profileUpdateData = {
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        whatsapp_number: formData.whatsapp_number || '',
        updated_at: new Date().toISOString(),
        ...(avatarUrl && { avatar_url: avatarUrl })
      };

      console.log("handleSubmit - Updating employer_profiles with:", profileUpdateData);

      if (formData.user_id) {
        const { error: profileError } = await supabase
          .from('employer_profiles')
          .upsert({ 
            id: formData.user_id, 
            ...profileUpdateData 
          });

        if (profileError) {
          console.error('Error updating employer profile:', profileError);
          throw profileError;
        }

        console.log("handleSubmit - Profile updated successfully");
        
        // Also update accounts table display_name if we have both names
        if (formData.first_name && formData.last_name && formData.id) {
          const displayName = `${formData.first_name} ${formData.last_name}`.trim();
          const { error: accountError } = await supabase
            .from('accounts')
            .update({ 
              display_name: displayName,
              updated_at: new Date().toISOString()
            })
            .eq('id', formData.id);

          if (accountError) {
            console.error('Error updating account display_name:', accountError);
            // Don't throw here as the profile update was successful
          }
        }
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }

      // Prepare data for parent component callback with consistent structure
      const updateData = {
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        whatsapp_number: formData.whatsapp_number || '',
        full_name: `${formData.first_name || ''} ${formData.last_name || ''}`.trim(),
        display_name: `${formData.first_name || ''} ${formData.last_name || ''}`.trim(),
        ...(avatarUrl && { avatar_url: avatarUrl })
      };

      console.log("handleSubmit - Calling onUpdateProfile with:", updateData);
      if (onUpdateProfile) {
        await onUpdateProfile(updateData);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isUpdating,
    isUploadingAvatar,
    handleEditClick,
    handleSubmit
  };
}
