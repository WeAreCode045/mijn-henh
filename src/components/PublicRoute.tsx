
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./ui/spinner";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, initialized } = useAuth();

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
    // Always redirect to root with replace to prevent navigation issues
    return <Navigate to="/" replace />;
  }

  // No authenticated user, render children
  return <>{children}</>;
};

export default PublicRoute;
