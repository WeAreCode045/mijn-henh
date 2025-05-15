
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./ui/spinner";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, initialized } = useAuth();

  // Add debugging to understand auth state
  console.log("PublicRoute - Auth state:", { user, isLoading, initialized });

  // If authentication state is still initializing, show a loading spinner
  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // If user exists after initialization, redirect to root
  if (user) {
    console.log("PublicRoute - User exists, redirecting to /");
    // Always redirect to root with replace to prevent navigation issues
    return <Navigate to="/" replace />;
  }

  // No authenticated user, render children
  console.log("PublicRoute - No user, rendering auth content");
  return <>{children}</>;
};

export default PublicRoute;
