
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "./common/LoadingSpinner";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    // Always redirect to root with replace to prevent navigation issues
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
