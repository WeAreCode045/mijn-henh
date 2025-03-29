import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AgendaDialogHeader } from "./form/DialogHeader";
import { AgendaDialogContent } from "./form/DialogContent";
import { AgendaDialogFooter } from "./form/DialogFooter";
import { AgendaAddEditDialogProps } from "./types";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/providers/AuthProvider";

export function AddEditAgendaDialog({
  isOpen,
  onOpenChange,
  onSave,
  title,
  setTitle,
  description,
  setDescription,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  additionalUsers,
  setAdditionalUsers,
  availableUsers: externalAvailableUsers,
  mode
}: AgendaAddEditDialogProps) {
  const { isLoading: usersLoading, users } = useUsers(); // Fetch all users
  const { user: currentUser } = useAuth();
  
  console.log("AddEditAgendaDialog - Users loading:", usersLoading);
  console.log("AddEditAgendaDialog - All users:", users);
  console.log("AddEditAgendaDialog - Current user:", currentUser?.id);
  
  // If external available users are provided, use them
  // Otherwise, transform users from useUsers hook, excluding the current user
  const availableUsers = externalAvailableUsers || 
    (users && users.length > 0 && currentUser?.id)
      ? users
          .filter(user => user.id !== currentUser.id)
          .map(user => ({
            id: user.id,
            name: user.full_name || user.email || `User ${user.id.substring(0, 8)}`
          }))
      : [];
  
  console.log("AddEditAgendaDialog - Available users for selection:", availableUsers);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <AgendaDialogHeader mode={mode} />
        
        <AgendaDialogContent 
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          endDate={endDate}
          setEndDate={setEndDate}
          endTime={endTime}
          setEndTime={setEndTime}
          additionalUsers={additionalUsers}
          setAdditionalUsers={setAdditionalUsers}
          availableUsers={availableUsers} 
          usersLoading={usersLoading}
        />
        
        <AgendaDialogFooter 
          onOpenChange={onOpenChange} 
          onSave={onSave} 
          mode={mode} 
        />
      </DialogContent>
    </Dialog>
  );
}
