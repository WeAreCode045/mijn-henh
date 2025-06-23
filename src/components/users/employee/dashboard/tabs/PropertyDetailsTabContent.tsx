
import { PropertyQuickview } from "../PropertyQuickview";
import { useSearchParams } from "react-router-dom";

export function PropertyDetailsTabContent() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');

  if (!propertyId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No property selected</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PropertyQuickview propertyId={propertyId} />
    </div>
  );
}
