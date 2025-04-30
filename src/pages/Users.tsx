
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { UserForm } from "@/components/users/UserForm";
import { UserList } from "@/components/users/UserList";
import { useUsers } from "@/hooks/useUsers";

const Users = () => {
  const { users, refetch, deleteUser, isLoading } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={handleAddNewClick}>Add New User</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <UserForm
            isEditMode={isEditMode}
            initialData={selectedUser || undefined}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      <UserList
        users={users || []}
        onEdit={handleEditClick}
        onDelete={deleteUser}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Users;
