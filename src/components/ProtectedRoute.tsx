
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./ui/spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initialized, userRole } = useAuth();
  const location = useLocation();

  // Add debugging to understand auth state
  console.log("ProtectedRoute - Auth state:", { 
    user: !!user, 
    isLoading, 
    initialized, 
    userRole,
    path: location.pathname
  });

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
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Check if participant is trying to access a non-participant route
  if ((userRole === 'buyer' || userRole === 'seller')) {
    // If participant trying to access root route, redirect to participant dashboard
    if (location.pathname === '/') {
      console.log("ProtectedRoute - Participant accessing root, redirecting to /participant");
      return <Navigate to="/participant" replace />;
    }
    
    // If participant trying to access non-participant routes, redirect to participant dashboard
    // List of routes that are not allowed for participants
    const restrictedRoutes = [
      '/properties',
      '/import',
      '/users',
      '/employees'
    ];
    
    if (restrictedRoutes.some(route => location.pathname.startsWith(route))) {
      console.log("ProtectedRoute - Participant accessing restricted route, redirecting to /participant");
      return <Navigate to="/participant" replace />;
    }
  }

  // If employee trying to access participant route, redirect to dashboard
  if (userRole !== 'buyer' && userRole !== 'seller' && location.pathname.startsWith('/participant')) {
    console.log("ProtectedRoute - Employee accessing participant route, redirecting to /");
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render children
  console.log("ProtectedRoute - User authenticated, rendering content");
  return <>{children}</>;
}
