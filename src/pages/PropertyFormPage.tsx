
import React, { useEffect } from "react";
import { PropertyFormContainer } from "./property/PropertyFormContainer";
import { useParams } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";

export default function PropertyFormPage() {
  const { id } = useParams();
  const { formData } = usePropertyForm(id);

  useEffect(() => {
    // Set document title based on property title
    if (formData?.title) {
      document.title = formData.title;
    } else {
      document.title = "Real Estate";
    }
    
    return () => {
      document.title = "Property Manager";
    };
  }, [formData?.title]);

  return (
    <div className="bg-estate-50 min-h-screen">
      <div className="container mx-auto py-8">
        <PropertyFormContainer />
      </div>
    </div>
  );
}
