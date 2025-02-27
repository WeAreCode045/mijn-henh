
import { useNavigate, useParams } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { useToast } from "@/components/ui/use-toast";

export default function EditPropertyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      <PropertyForm />
    </div>
  );
}
