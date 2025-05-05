
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./ui/spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initialized } = useAuth();

  // Add debugging to understand auth state
  console.log("ProtectedRoute - Auth state:", { user, isLoading, initialized });

  // If authentication state is still initializing, show a loading spinner
  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // If no user after initialization, redirect to auth
  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to /auth");
    // Always redirect to auth with replace to prevent navigation issues
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render children
  console.log("ProtectedRoute - User authenticated, rendering content");
  return <>{children}</>;
}
