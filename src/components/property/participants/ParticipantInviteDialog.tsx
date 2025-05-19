
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ParticipantSelectDialog } from "./ParticipantSelectDialog";
import { PlusCircle, UserPlus } from "lucide-react";

interface ParticipantInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  role: 'seller' | 'buyer';  // Explicitly restrict to only seller or buyer
}

export function ParticipantInviteDialog({
  open,
  onOpenChange,
  propertyId,
  role,
}: ParticipantInviteDialogProps) {
  const [showSelectDialog, setShowSelectDialog] = useState(false);
  const { toast } = useToast();

  // Handle the dialog close event
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowSelectDialog(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add {role === "seller" ? "Seller" : "Buyer"}
          </DialogTitle>
          <DialogDescription>
            Select an existing participant or create a new one.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <Button 
            onClick={() => {
              setShowSelectDialog(true);
              onOpenChange(false);
            }}
            className="w-full justify-center py-6"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Select Existing Participant
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              // Navigate to participants page
              window.location.href = "/participants";
            }}
            className="w-full justify-center py-6"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Participant
          </Button>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Participant Select Dialog */}
      <ParticipantSelectDialog
        open={showSelectDialog}
        onOpenChange={handleDialogClose}
        propertyId={propertyId}
        role={role}
      />
    </Dialog>
  );
}
