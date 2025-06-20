
import { useState, useEffect } from "react";
import { User } from "@/types/user";

export function useUserProfileData(user: User) {
  console.log("useUserProfileData - User object received:", user);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
  });

  useEffect(() => {
    console.log("useUserProfileData - Setting form data from user:", {
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      whatsapp_number: user.whatsapp_number
    });
    
    // Extract first_name and last_name from full_name if they're not available
    let firstName = user.first_name || "";
    let lastName = user.last_name || "";
    
    // Only try to parse full_name if we don't have both first and last names
    if ((!firstName || !lastName) && user.full_name) {
      const nameParts = user.full_name.trim().split(" ");
      if (!firstName) firstName = nameParts[0] || "";
      if (!lastName) lastName = nameParts.slice(1).join(" ") || "";
    }
    
    const newFormData = {
      first_name: firstName,
      last_name: lastName,
      email: user.email || "",
      phone: user.phone || "",
      whatsapp_number: user.whatsapp_number || "",
    };
    
    console.log("useUserProfileData - Setting formData to:", newFormData);
    setFormData(newFormData);
  }, [user.id, user.first_name, user.last_name, user.full_name, user.email, user.phone, user.whatsapp_number]);

  // Create display name with fallback logic
  const displayName = (() => {
    const formFirstName = formData.first_name || user.first_name || '';
    const formLastName = formData.last_name || user.last_name || '';
    const combinedName = `${formFirstName} ${formLastName}`.trim();
    
    if (combinedName) {
      return combinedName;
    }
    
    if (user.full_name) {
      return user.full_name;
    }
    
    if (user.display_name) {
      return user.display_name;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Unknown';
  })();

  console.log("useUserProfileData - Final formData state:", formData);
  console.log("useUserProfileData - Display name:", displayName);

  return {
    formData,
    setFormData,
    displayName,
    isLoadingProfile: false,
  };
}
