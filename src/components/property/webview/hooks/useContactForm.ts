
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { AgencySettings } from "@/types/agency";
import { PropertyData } from "@/types/property";
import { ContactFormData, submitContactForm } from "../utils/contactFormUtils";

export function useContactForm(property: PropertyData, settings: AgencySettings) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiry_type: "information" // Default to "meer informatie"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting contact form for property:", property.id);
    console.log("Form data:", formData);

    try {
      const result = await submitContactForm(formData, property, settings);
      console.log("Form submission result:", result);

      // Success message
      toast({
        title: "Bericht succesvol verzonden!",
        description: "We nemen zo snel mogelijk contact met u op.",
      });

      // Reset the form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        inquiry_type: "information"
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: error instanceof Error ? error.message : "Fout bij het versturen van het formulier",
        description: "Probeer het later opnieuw.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  return {
    formData,
    handleChange,
    handleSelectChange,
    handleSubmit,
    isSubmitting
  };
}
