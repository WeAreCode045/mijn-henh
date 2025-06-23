import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { EmployeeForm } from "@/components/users/employee/forms/EmployeeForm";
import { EmployeeList } from "@/components/users/employee/EmployeeList";
import { useEmployeeManagement } from "@/hooks/users/employee/useEmployeeManagement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const EmployeesPage = () => {
  const { users, refetch, deleteUser, isLoading, error, isAuthenticated } = useEmployeeManagement();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Debug information
  console.log("EmployeesPage component rendering with:", { users, isLoading, error, isAuthenticated });

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    refetch();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={handleAddNewClick}>Add New Employee</Button>
      </div>

      {!isAuthenticated && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to view employees. Please log in with an admin account.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error loading employees: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            isEditMode={isEditMode}
            initialData={selectedUser || undefined}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      <EmployeeList
        users={users || []}
        onEdit={handleEditClick}
        onDelete={deleteUser}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EmployeesPage;
