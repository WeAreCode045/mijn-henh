
import { CardContent } from "@/components/ui/card";
import { PropertyFormContainer } from "@/pages/property/PropertyFormContainer";

export function PropertyDetailsTabContent() {
  return (
    <CardContent className="p-6">
      <PropertyFormContainer />
    </CardContent>
  );
}
