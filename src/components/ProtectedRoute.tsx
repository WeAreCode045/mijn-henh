
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "./common/LoadingSpinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Always redirect to auth with replace to prevent navigation issues
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
