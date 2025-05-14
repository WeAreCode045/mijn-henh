
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./ui/spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initialized } = useAuth();

  // Add debugging to understand auth state
  console.log("ProtectedRoute - Auth state:", { user, isLoading, initialized });

  // Maximum loading time - if loading takes longer than 5 seconds, we'll show the content
  // with a warning that authentication might not be complete
  const showContentAnyway = !initialized && Date.now() - window.performance.timeOrigin > 5000;

  if (showContentAnyway) {
    console.warn("Authentication check is taking too long - showing content anyway");
    return <>{children}</>;
  }

  // If authentication state is still initializing, show a loading spinner
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
    // Always redirect to auth with replace to prevent navigation issues
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render children
  console.log("ProtectedRoute - User authenticated, rendering content");
  return <>{children}</>;
}
