
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParticipants } from "@/hooks/useParticipants";
import { ParticipantProfileData } from "@/types/participant";
import { UserPlus } from "lucide-react";
import { PropertyLayout } from "@/components/PropertyLayout";
import { Spinner } from "@/components/ui/spinner";
import { ParticipantForm } from "@/components/participants/ParticipantForm";
import { ParticipantList } from "@/components/participants/ParticipantList";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Participants = () => {
  const { participants, isLoading, error, refetch } = useParticipants();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantProfileData | null>(null);
  const { toast } = useToast();

  const handleEdit = (participant: ParticipantProfileData) => {
    console.log("Participants - Editing participant:", participant);
    setSelectedParticipant(participant);
    setIsEditMode(true);
    setIsFormDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedParticipant(null);
    setIsEditMode(false);
    setIsFormDialogOpen(true);
  };

  const handleDelete = async (participantId: string) => {
    if (!window.confirm("Are you sure you want to delete this participant?")) {
      return;
    }

    try {
      console.log("Participants - Deleting participant with ID:", participantId);
      
      // Delete from accounts table (this should cascade to participants_profile)
      const { error: accountError } = await supabase
        .from('accounts')
        .delete()
        .eq('user_id', participantId);
      
      if (accountError) {
        console.error("Error deleting from accounts:", accountError);
        throw accountError;
      }
      
      toast({
        title: "Success",
        description: "Participant deleted successfully",
      });

      refetch();
    } catch (error: any) {
      console.error("Error in deleteParticipant:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete participant",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormDialogOpen(false);
    refetch();
  };

  console.log("Participants page loaded");
  console.log("Participants data:", participants);

  return (
    <PropertyLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Participants</h1>
          <Button onClick={handleCreate}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Participant
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>Error loading participants: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
            <span className="ml-2">Loading participants...</span>
          </div>
        ) : (
          <ParticipantList
            participants={participants}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        )}

        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Participant" : "Create New Participant"}
              </DialogTitle>
            </DialogHeader>
            <ParticipantForm
              isEditMode={isEditMode}
              initialData={selectedParticipant || undefined}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PropertyLayout>
  );
};

export default Participants;
