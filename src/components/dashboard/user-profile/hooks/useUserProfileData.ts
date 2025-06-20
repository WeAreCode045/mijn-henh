
import { useState, useEffect } from "react";
import { User } from "@/types/user";

export function useUserProfileData(user: User) {
  console.log("useUserProfileData - User data received:", user);
  console.log("useUserProfileData - User first_name:", user.first_name);
  console.log("useUserProfileData - User last_name:", user.last_name);
  
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
    console.log("useUserProfileData - useEffect triggered with user:", {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      whatsapp_number: user.whatsapp_number
    });
    
    // Initialize form data with user data
    const newFormData = {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      whatsapp_number: user.whatsapp_number || "",
    };
    
    console.log("useUserProfileData - Setting new form data:", newFormData);
    setFormData(newFormData);
  }, [user.first_name, user.last_name, user.email, user.phone, user.whatsapp_number, user.id]);

  console.log("useUserProfileData - Current formData:", formData);

  return {
    formData,
    setFormData,
    displayName,
    isLoadingProfile: false,
    fetchCompleteProfile: async () => {}
  };
}
