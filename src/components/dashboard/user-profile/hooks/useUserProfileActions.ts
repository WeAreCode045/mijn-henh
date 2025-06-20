
import { useState } from "react";
import { User } from "@/types/user";

export function useUserProfileActions(
  onUpdateProfile?: (updatedUser: Partial<User>) => Promise<void>,
  fetchCompleteProfile?: () => Promise<void>
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = async () => {
    setIsEditing(true);
    if (fetchCompleteProfile) {
      await fetchCompleteProfile();
    }
  };

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    if (!onUpdateProfile) return;

    setIsUpdating(true);
    try {
      await onUpdateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        whatsapp_number: formData.whatsapp_number,
        full_name: `${formData.first_name} ${formData.last_name}`.trim()
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isUpdating,
    handleEditClick,
    handleSubmit
  };
}
