
import { PropertyInformationCard } from "@/components/property/PropertyInformationCard";

interface PropertyFormHeaderProps {
  title: string;
  propertyId?: string;
  objectId?: string;
}

export function PropertyFormHeader({ title, propertyId, objectId }: PropertyFormHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-estate-800">
          {title}
        </h1>
      </div>
    </>
  );
}
