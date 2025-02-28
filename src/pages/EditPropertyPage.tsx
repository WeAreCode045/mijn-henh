
import React from "react";
import { PropertyFormContainer } from "./property/PropertyFormContainer";

export default function EditPropertyPage() {
  // Use PropertyFormContainer which handles both creation and editing
  return (
    <div className="container mx-auto py-8">
      <PropertyFormContainer />
    </div>
  );
}
