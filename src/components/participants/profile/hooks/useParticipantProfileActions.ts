
import { useState } from "react";
import { ParticipantProfileData } from "@/types/participant";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useParticipantProfileActions(
  onUpdateProfile?: (updatedData: Partial<ParticipantProfileData>) => Promise<void>
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    console.log("handleSubmit - Form data received:", formData);
    
    setIsUpdating(true);
    
    try {
      // Update participants_profile table
      const profileUpdateData = {
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        whatsapp_number: formData.whatsapp_number || '',
        date_of_birth: formData.date_of_birth || null,
        place_of_birth: formData.place_of_birth || '',
        nationality: formData.nationality || '',
        gender: formData.gender || '',
        address: formData.address || '',
        city: formData.city || '',
        postal_code: formData.postal_code || '',
        country: formData.country || '',
        iban: formData.iban || '',
        identification: formData.identification || {
          type: null,
          social_number: null,
          document_number: null
        },
        updated_at: new Date().toISOString(),
      };

      console.log("handleSubmit - Updating participants_profile with:", profileUpdateData);

      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error: profileError } = await supabase
        .from('participants_profile')
        .update(profileUpdateData)
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating participant profile:', profileError);
        throw profileError;
      }

      console.log("handleSubmit - Profile updated successfully");
      
      // Also update accounts table display_name if we have both names
      if (formData.first_name && formData.last_name) {
        const displayName = `${formData.first_name} ${formData.last_name}`.trim();
        const { error: accountError } = await supabase
          .from('accounts')
          .update({ 
            display_name: displayName,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (accountError) {
          console.error('Error updating account display_name:', accountError);
          // Don't throw here as the profile update was successful
        }
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Prepare data for parent component callback
      const updateData = {
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        whatsapp_number: formData.whatsapp_number || '',
        date_of_birth: formData.date_of_birth || null,
        place_of_birth: formData.place_of_birth || '',
        nationality: formData.nationality || '',
        gender: formData.gender || '',
        address: formData.address || '',
        city: formData.city || '',
        postal_code: formData.postal_code || '',
        country: formData.country || '',
        iban: formData.iban || '',
        identification: formData.identification,
        full_name: `${formData.first_name || ''} ${formData.last_name || ''}`.trim(),
      };

      console.log("handleSubmit - Calling onUpdateProfile with:", updateData);
      if (onUpdateProfile) {
        await onUpdateProfile(updateData);
      }
      
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
    isUpdating,
    handleSubmit
  };
}
