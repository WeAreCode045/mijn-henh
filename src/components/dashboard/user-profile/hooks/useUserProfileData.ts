
import { useState, useEffect } from "react";
import { User } from "@/types/user";

export function useUserProfileData(user: User) {
  console.log("useUserProfileData - User data received:", user);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
  });

  const displayName = `${formData.first_name || user.first_name || ''} ${formData.last_name || user.last_name || ''}`.trim() || 
                      (user.email ? user.email.split('@')[0] : 'Unknown');

  useEffect(() => {
    console.log("useUserProfileData - Setting form data from user:", {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      whatsapp_number: user.whatsapp_number
    });
    
    // Initialize form data with user data that already includes employer_profiles data
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      whatsapp_number: user.whatsapp_number || "",
    });
  }, [user.first_name, user.last_name, user.email, user.phone, user.whatsapp_number]);

  return {
    formData,
    setFormData,
    displayName,
    isLoadingProfile: false, // No longer needed since data comes from useUsers
    fetchCompleteProfile: async () => {} // No longer needed since data comes from useUsers
  };
}
