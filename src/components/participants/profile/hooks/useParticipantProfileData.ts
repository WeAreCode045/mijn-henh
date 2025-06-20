
import { useState, useEffect } from "react";
import { ParticipantProfileData } from "@/types/participant";

export function useParticipantProfileData(participant: ParticipantProfileData) {
  console.log("useParticipantProfileData - Participant object received:", participant);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
    date_of_birth: "",
    place_of_birth: "",
    nationality: "",
    gender: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    iban: "",
    identification: {
      type: null as string | null,
      social_number: null as string | null,
      document_number: null as string | null,
    },
  });

  useEffect(() => {
    console.log("useParticipantProfileData - Setting form data from participant:", participant);
    
    const newFormData = {
      first_name: participant.first_name || "",
      last_name: participant.last_name || "",
      email: participant.email || "",
      phone: participant.phone || "",
      whatsapp_number: participant.whatsapp_number || "",
      date_of_birth: participant.date_of_birth || "",
      place_of_birth: participant.place_of_birth || "",
      nationality: participant.nationality || "",
      gender: participant.gender || "",
      address: participant.address || "",
      city: participant.city || "",
      postal_code: participant.postal_code || "",
      country: participant.country || "",
      iban: participant.iban || "",
      identification: {
        type: participant.identification?.type || null,
        social_number: participant.identification?.social_number || null,
        document_number: participant.identification?.document_number || null,
      },
    };
    
    console.log("useParticipantProfileData - Setting formData to:", newFormData);
    setFormData(newFormData);
  }, [participant.id, participant.first_name, participant.last_name, participant.email, participant.phone, participant.whatsapp_number]);

  // Create display name with fallback logic
  const displayName = (() => {
    const formFirstName = formData.first_name || participant.first_name || '';
    const formLastName = formData.last_name || participant.last_name || '';
    const combinedName = `${formFirstName} ${formLastName}`.trim();
    
    if (combinedName) {
      return combinedName;
    }
    
    if (participant.full_name) {
      return participant.full_name;
    }
    
    if (participant.email) {
      return participant.email.split('@')[0];
    }
    
    return 'Unknown';
  })();

  console.log("useParticipantProfileData - Final formData state:", formData);
  console.log("useParticipantProfileData - Display name:", displayName);

  return {
    formData,
    setFormData,
    displayName,
    isLoadingProfile: false,
  };
}
