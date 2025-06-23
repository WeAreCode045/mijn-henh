
import { useState } from "react";
import { ParticipantFormData, ParticipantRole } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { ParticipantProfileData } from "@/types/participant";
import { useParticipantFormSubmit } from "@/hooks/participants/useParticipantFormSubmit";
import { BasicInfoSection } from "./form/BasicInfoSection";
import { PersonalDetailsSection } from "./form/PersonalDetailsSection";
import { AddressSection } from "./form/AddressSection";
import { IdentificationSection } from "./form/IdentificationSection";
import { FinancialInfoSection } from "./form/FinancialInfoSection";

interface ParticipantFormProps {
  isEditMode: boolean;
  initialData?: ParticipantProfileData;
  onSuccess: () => void;
}

export function ParticipantForm({ isEditMode, initialData, onSuccess }: ParticipantFormProps) {
  // Simplified form data for creation - only required fields
  const [formData, setFormData] = useState<ParticipantFormData>({
    email: initialData?.email || "",
    password: "",
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    role: (initialData?.role as ParticipantRole) || "buyer",
    // Optional fields with defaults
    phone: initialData?.phone || "",
    whatsapp_number: initialData?.whatsapp_number || "",
    date_of_birth: initialData?.date_of_birth || "",
    place_of_birth: initialData?.place_of_birth || "",
    nationality: initialData?.nationality || "",
    gender: initialData?.gender || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    postal_code: initialData?.postal_code || "",
    country: initialData?.country || "",
    iban: initialData?.iban || "",
    identification: initialData?.identification || {
      type: null,
      social_number: "",
      document_number: ""
    }
  });

  const { handleSubmit, isSubmitting } = useParticipantFormSubmit({
    isEditMode,
    initialData,
    onSuccess
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <BasicInfoSection 
        formData={formData} 
        setFormData={setFormData} 
        isEditMode={isEditMode} 
      />

      {isEditMode && (
        <>
          <PersonalDetailsSection 
            formData={formData} 
            setFormData={setFormData} 
          />

          <AddressSection 
            formData={formData} 
            setFormData={setFormData} 
          />

          <IdentificationSection 
            formData={formData} 
            setFormData={setFormData} 
          />

          <FinancialInfoSection 
            formData={formData} 
            setFormData={setFormData} 
          />
        </>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Participant" : "Create Participant")}
      </Button>
    </form>
  );
}
