
import { CardContent } from "@/components/ui/card";
import { PropertyFormContainer } from "@/pages/property/PropertyFormContainer";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export function PropertyDetailsTabContent() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  
  // Log the property ID to debug
  useEffect(() => {
    console.log("PropertyDetailsTabContent - Property ID:", propertyId);
  }, [propertyId]);

  return (
    <CardContent className="p-6">
      <PropertyFormContainer />
    </CardContent>
  );
}
