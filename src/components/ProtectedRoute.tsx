
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { Spinner } from "./ui/spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initialized } = useAuth();

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
    // Always redirect to auth with replace to prevent navigation issues
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
