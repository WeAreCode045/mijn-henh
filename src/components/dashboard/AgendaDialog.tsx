
import { useEffect } from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { useAuth } from "@/providers/AuthProvider";
import { useUsers } from "@/hooks/useUsers";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AgendaDialogHeader } from "./agenda/AgendaDialogHeader";
import { AgendaDialogForm } from "./agenda/AgendaDialogForm";
import { AgendaDialogFooter } from "./agenda/AgendaDialogFooter";

interface AgendaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AgendaItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  item?: AgendaItem | null;
  mode: "add" | "edit";
  propertyId?: string; // Add propertyId prop to pass from parent
}

export function AgendaDialog({
  isOpen,
  onClose,
  onSave,
  item,
  mode,
  propertyId,
}: AgendaDialogProps) {
  const { user } = useAuth();
  const { users, isLoading: usersLoading } = useUsers();
  
  // Transform users from useUsers hook, excluding the current user
  const availableUsers = users
    .filter(u => u.id !== user?.id) // Filter out current user
    .map(u => ({
      id: u.id,
      name: u.full_name || u.email || `User ${u.id.substring(0, 8)}`
    }));
    
  console.log("AgendaDialog - Available users:", availableUsers);
  console.log("AgendaDialog - Current user:", user?.id);
  console.log("AgendaDialog - All users:", users);
  console.log("AgendaDialog - Users loading:", usersLoading);

  const {
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    time,
    setTime,
    selectedPropertyId,
    setSelectedPropertyId,
    additionalUsers,
    setAdditionalUsers,
    isSaving,
    handleSave,
  } = useAgendaDialog(item, mode);

  // Set the selectedPropertyId from prop if available
  useEffect(() => {
    if (propertyId && !selectedPropertyId) {
      setSelectedPropertyId(propertyId);
    }
  }, [propertyId, selectedPropertyId, setSelectedPropertyId]);

  const handleSaveClick = async () => {
    const success = await handleSave(onSave);
    if (success) {
      onClose();
    }
  };

  // Make sure to reset the form when the dialog closes
  useEffect(() => {
    if (!isOpen) {
      // The hook will reset on mode/item change, no need to duplicate here
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <AgendaDialogHeader mode={mode} />
        
        <AgendaDialogForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          selectedPropertyId={selectedPropertyId}
          setSelectedPropertyId={setSelectedPropertyId}
          additionalUsers={additionalUsers}
          setAdditionalUsers={setAdditionalUsers}
          availableUsers={availableUsers}
          usersLoading={usersLoading}
        />
        
        <AgendaDialogFooter
          onClose={onClose}
          onSave={handleSaveClick}
          isSaving={isSaving}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
}
