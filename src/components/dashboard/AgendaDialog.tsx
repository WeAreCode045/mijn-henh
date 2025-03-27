
import { useEffect } from "react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { useAuth } from "@/providers/AuthProvider";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useAgendaDialog } from "@/hooks/useAgendaDialog";
import { AgendaDialogHeader } from "./agenda/AgendaDialogHeader";
import { AgendaDialogForm } from "./agenda/AgendaDialogForm";
import { AgendaDialogFooter } from "./agenda/AgendaDialogFooter";

interface AgendaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AgendaItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  item?: AgendaItem | null;
  mode: "add" | "edit";
}

export function AgendaDialog({
  isOpen,
  onClose,
  onSave,
  item,
  mode,
}: AgendaDialogProps) {
  const { user } = useAuth();
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
    isSaving,
    handleSave
  } = useAgendaDialog(item, mode);

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
