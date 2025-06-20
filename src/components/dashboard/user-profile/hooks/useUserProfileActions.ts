
import { useState } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useUserProfileActions(
  onUpdateProfile?: (updatedUser: Partial<User>) => Promise<void>,
  fetchCompleteProfile?: () => Promise<void>
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { toast } = useToast();

  const handleEditClick = async () => {
    setIsEditing(true);
    if (fetchCompleteProfile) {
      await fetchCompleteProfile();
    }
  };

  const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
    try {
      setIsUploadingAvatar(true);
      
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
    if (!onUpdateProfile) return;

    setIsUpdating(true);
    try {
      let avatarUrl = null;
      
      // Upload avatar if provided
      if (avatarFile && formData.user_id) {
        avatarUrl = await uploadAvatar(avatarFile, formData.user_id);
      }

      // Update employer_profiles table using user_id
      const profileUpdateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        whatsapp_number: formData.whatsapp_number,
        ...(avatarUrl && { avatar_url: avatarUrl })
      };

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

        // The trigger will automatically update the display_name in accounts table
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }

      // Prepare data for parent component callback
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        whatsapp_number: formData.whatsapp_number,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        ...(avatarUrl && { avatar_url: avatarUrl })
      };

      await onUpdateProfile(updateData);
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
