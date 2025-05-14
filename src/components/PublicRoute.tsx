
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./ui/spinner";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, initialized, userRole } = useAuth();

  // Add debugging to understand auth state
  console.log("PublicRoute - Auth state:", { user, isLoading, initialized, userRole });

  // If authentication state is still initializing, show a loading spinner
  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner className="h-10 w-10" />
        <p className="mt-4 text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  // If user exists after initialization, redirect based on role
  if (user) {
    console.log("PublicRoute - User exists, redirecting based on role");
    // Direct participants to their dashboard, others to main dashboard
    const redirectPath = (userRole === 'buyer' || userRole === 'seller') ? '/participant' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // No authenticated user, render children
  console.log("PublicRoute - No user, rendering auth content");
  return <>{children}</>;
};

export default PublicRoute;
