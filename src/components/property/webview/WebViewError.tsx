
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WebViewErrorProps {
  error?: string | null;
  isDialog?: boolean;
}

export function WebViewError({ error, isDialog = false }: WebViewErrorProps) {
  const navigate = useNavigate();
  
  // Create a more user-friendly error message
  const errorMessage = error?.includes("not found") 
    ? "We couldn't find the property you're looking for. It may have been removed or the URL is incorrect."
    : error || "There was a problem loading this property. Please try again later.";
  
  return (
    <div className={`${isDialog ? "" : "min-h-screen"} bg-white flex flex-col items-center justify-center p-4`}>
      <div className="max-w-md w-full text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800">Property Not Found</h1>
        <p className="text-gray-600">{errorMessage}</p>
        <div className="flex space-x-4 justify-center">
          <Button onClick={() => navigate('/properties')} variant="default">
            View All Properties
          </Button>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
