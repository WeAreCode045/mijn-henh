
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./ui/spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initialized } = useAuth();

  // Add debugging to understand auth state
  console.log("ProtectedRoute - Auth state:", { user, isLoading, initialized });

  // Only show loading state if auth is still initializing
  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner className="h-10 w-10" />
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // If no user after initialization, redirect to auth
  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render children
  console.log("ProtectedRoute - User authenticated, rendering content");
  return <>{children}</>;
}
