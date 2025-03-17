
import { PropertyForm } from "@/components/PropertyForm";

export default function AddPropertyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Property</h1>
      <PropertyForm />
    </div>
  );
}
