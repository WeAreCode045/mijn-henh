
import { useState } from "react";
import { ParticipantFormData, ParticipantProfileData } from "@/types/participant";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseParticipantFormSubmitProps {
  isEditMode: boolean;
  initialData?: ParticipantProfileData;
  onSuccess: () => void;
}

export function useParticipantFormSubmit({ isEditMode, initialData, onSuccess }: UseParticipantFormSubmitProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ParticipantFormData) => {
    setIsSubmitting(true);

    try {
      if (isEditMode && initialData) {
        console.log("=== EDIT MODE DEBUG ===");
        console.log("Initial data:", initialData);
        console.log("Form data:", formData);

        // Update participants_profile table
        if (initialData.id) {
          console.log("Updating participants_profile for id:", initialData.id);
          
          const updateData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            whatsapp_number: formData.whatsapp_number,
            date_of_birth: formData.date_of_birth || null,
            place_of_birth: formData.place_of_birth,
            nationality: formData.nationality,
            gender: formData.gender,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postal_code,
            country: formData.country,
            iban: formData.iban,
            identification: formData.identification,
            updated_at: new Date().toISOString(),
          };
          
          console.log("Profile update data:", updateData);
          
          const { error: profileError } = await supabase
            .from("participants_profile")
            .update(updateData)
            .eq("id", initialData.id);

          if (profileError) {
            console.error("Error updating participants_profile:", profileError);
            throw new Error(`Failed to update profile: ${profileError.message}`);
          }
          console.log("Successfully updated participants_profile");
        }
        
        // Update accounts table - find account by user_id matching the profile id
        console.log("Updating accounts for user_id:", initialData.id);
        
        const accountUpdateData = {
          role: formData.role,
          type: 'participant' as const,
          display_name: `${formData.first_name} ${formData.last_name}`.trim(),
          email: formData.email,
          updated_at: new Date().toISOString()
        };
        
        console.log("Account update data:", accountUpdateData);
        
        const { error: roleError } = await supabase
          .from("accounts")
          .update(accountUpdateData)
          .eq("user_id", initialData.id);
          
        if (roleError) {
          console.error("Error updating accounts:", roleError);
          throw new Error(`Failed to update account: ${roleError.message}`);
        }
        console.log("Successfully updated accounts");

        toast({
          title: "Success",
          description: "Participant updated successfully",
        });
      } else {
        // CREATE MODE - Direct participant creation
        console.log("=== CREATE MODE DEBUG ===");
        console.log("Creating new participant with data:", formData);
        
        // Step 1: Create user in auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password!,
          options: {
            data: {
              full_name: `${formData.first_name} ${formData.last_name}`.trim(),
              phone: formData.phone,
            },
          },
        });

        if (authError) {
          console.error("Auth signup error:", authError);
          throw new Error(`Failed to create user: ${authError.message}`);
        }

        if (!authData.user) {
          throw new Error("No user returned from signup");
        }

        console.log("User created in auth, user_id:", authData.user.id);

        // Step 2: Create participant account directly
        console.log("Creating participant account directly");
        
        const { error: accountError } = await supabase
          .from("accounts")
          .insert({
            user_id: authData.user.id,
            role: formData.role,
            type: 'participant' as const,
            status: 'active',
            display_name: `${formData.first_name} ${formData.last_name}`.trim(),
            email: formData.email,
          });

        if (accountError) {
          console.error("Error creating participant account:", accountError);
          throw new Error(`Failed to create participant account: ${accountError.message}`);
        }
        console.log("Successfully created participant account");

        // Step 3: Wait briefly for trigger to create basic profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 4: Update participant profile with additional data if provided
        const hasAdditionalData = formData.phone || formData.whatsapp_number || formData.date_of_birth || 
                                 formData.place_of_birth || formData.nationality || formData.gender ||
                                 formData.address || formData.city || formData.postal_code || 
                                 formData.country || formData.iban;

        if (hasAdditionalData) {
          console.log("Updating participant profile with additional data");
          const { error: profileUpdateError } = await supabase
            .from("participants_profile")
            .update({
              phone: formData.phone,
              whatsapp_number: formData.whatsapp_number,
              date_of_birth: formData.date_of_birth || null,
              place_of_birth: formData.place_of_birth,
              nationality: formData.nationality,
              gender: formData.gender,
              address: formData.address,
              city: formData.city,
              postal_code: formData.postal_code,
              country: formData.country,
              iban: formData.iban,
              identification: formData.identification,
              updated_at: new Date().toISOString()
            })
            .eq("id", authData.user.id);

          if (profileUpdateError) {
            console.error("Error updating participant profile with additional data:", profileUpdateError);
            // Don't throw here - basic profile should exist from trigger
            console.log("Profile update failed but basic profile should exist from trigger");
          } else {
            console.log("Participant profile updated with additional data successfully");
          }
        }

        toast({
          title: "Success",
          description: "Participant created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
}
