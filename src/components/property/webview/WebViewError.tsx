
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WebViewErrorProps {
  error?: Error | string;
}

export function WebViewError({ error }: WebViewErrorProps) {
  const navigate = useNavigate();
  
  // Get error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'An unknown error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Property
        </h2>
        
        <p className="text-gray-600 mb-6">
          We couldn't load this property. The error was:
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
          <p className="text-red-700 text-sm font-mono break-words">
            {errorMessage}
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={() => navigate('/properties')}
            variant="default"
          >
            Return to Properties
          </Button>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
