
import React, { useEffect } from "react";
import { PropertyFormContainer } from "./property/PropertyFormContainer";
import { useParams, useLocation } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";

export default function PropertyFormPage() {
  const { id, step } = useParams();
  const location = useLocation();
  const { formData, isLoading } = usePropertyForm(id);

  useEffect(() => {
    // Log to help with debugging
    console.log("PropertyFormPage - Path:", location.pathname);
    console.log("PropertyFormPage - ID param:", id);
    console.log("PropertyFormPage - Step param:", step);
    console.log("PropertyFormPage - Has formData:", !!formData);
    console.log("PropertyFormPage - FormData:", formData ? { id: formData.id, title: formData.title } : null);
    
    // Set document title based on property title
    if (formData?.title) {
      document.title = formData.title;
    } else {
      document.title = "Property Editor";
    }
    
    return () => {
      document.title = "Property Manager";
    };
  }, [formData?.title, location.pathname, id, step, formData]);

  // Determine if we're in content mode by checking the URL path
  const isContentMode = location.pathname.includes('/content/');
  const currentContentStep = step ? { 'general': 0, 'location': 1, 'features': 2, 'areas': 3 }[step] || 0 : 0;

  return (
    <div className="bg-estate-50 min-h-screen">
      <div className="container mx-auto py-8">
        <PropertyFormContainer 
          propertyId={id} 
          initialTab={isContentMode ? 'content' : undefined}
          initialContentStep={isContentMode ? currentContentStep : undefined}
        />
      </div>
    </div>
  );
}
