
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import EmployeeDashboard from "./users/employee/EmployeeDashboard";
import ParticipantDashboard from "@/components/users/participant/dashboard/ParticipantDashboard";

export default function Index() {
  const { user, userRole, isLoading } = useAuth();

  // Show loading spinner while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If no user, this will be handled by the ProtectedRoute wrapper
  if (!user) {
    return null;
  }

  // Route based on user role
  const isEmployee = userRole === 'admin' || userRole === 'agent' || userRole === 'employee';
  const isParticipant = userRole === 'buyer' || userRole === 'seller';

  console.log("Index page routing - userRole:", userRole, "isEmployee:", isEmployee, "isParticipant:", isParticipant);

  if (isEmployee) {
    return <EmployeeDashboard />;
  }

  if (isParticipant) {
    return <ParticipantDashboard />;
  }

  // Fallback for unknown roles
  return (
    <div className="container mx-auto pt-4 pb-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <p className="text-muted-foreground">
          Your account role ({userRole}) is not recognized. Please contact support.
        </p>
      </div>
    </div>
  );
}
