
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface FormStepActionsProps {
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export function FormStepActions({
  onSubmit,
  isSubmitting = false,
  submitText = "Save Property"
}: FormStepActionsProps) {
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default form submission
    onSubmit();
  };

  return (
    <div className="flex justify-end mt-6">
      <Button 
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            {submitText}
          </>
        )}
      </Button>
    </div>
  );
}
