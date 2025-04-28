
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-estate-800"></div>
  </div>
);

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    // Use replace prop to prevent back navigation issues
    // Remove any potential circular redirects
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
