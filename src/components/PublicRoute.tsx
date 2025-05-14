
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./ui/spinner";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  try {
    console.log("PublicRoute - Initializing");
    const { user, isLoading, initialized } = useAuth();

    // Add debugging to understand auth state
    console.log("PublicRoute - Auth state:", { user, isLoading, initialized });

    // Don't redirect if we're still loading or auth isn't initialized yet
    if (isLoading || !initialized) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Spinner className="h-10 w-10" />
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      );
    }

    // Only redirect to home if we're fully initialized AND have a user
    if (user) {
      console.log("PublicRoute - User exists, redirecting to /");
      return <Navigate to="/" replace />;
    }

    // No authenticated user, render children
    console.log("PublicRoute - No user, rendering auth content");
    return <>{children}</>;
  } catch (error) {
    console.error("Error in PublicRoute:", error);
    // Fallback to rendering children if there's an error with auth context
    return <>{children}</>;
  }
};

export default PublicRoute;
