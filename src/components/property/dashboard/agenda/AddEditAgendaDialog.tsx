
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AgendaDialogHeader } from "./form/DialogHeader";
import { AgendaDialogContent } from "./form/DialogContent";
import { AgendaDialogFooter } from "./form/DialogFooter";
import { AgendaAddEditDialogProps } from "./types";
import { useUsers } from "@/hooks/useUsers";

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
  availableUsers,
  mode
}: AgendaAddEditDialogProps) {
  const { isLoading: usersLoading } = useUsers();
  
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
