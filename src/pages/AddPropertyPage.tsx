
import { PropertyForm } from "@/components/PropertyForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Property</h1>
      <PropertyForm />
    </div>
  );
}
