
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
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContactForm(formData, property, settings);

      // Success message
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset the form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: error instanceof Error ? error.message : "Error submitting form",
        description: "Please try again later.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting
  };
}
