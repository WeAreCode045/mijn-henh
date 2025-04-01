
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  errorMessage: string;
}

export const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-md text-center">
      <AlertCircle className="mx-auto h-10 w-10 mb-4 text-destructive" />
      <p className="mb-4">{errorMessage}</p>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => window.location.href = "/settings"}
      >
        Go to Settings
      </Button>
    </div>
  );
};
