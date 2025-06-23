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
import { useParticipantProfile } from "@/components/users/participant/profile/hooks/useParticipantProfile";
import { Spinner } from "@/components/ui/spinner";
import { ParticipantForm } from "@/components/users/participant/forms/ParticipantForm";
import { ParticipantList } from "@/components/users/participant/ParticipantList";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyLayout } from "@/components/PropertyLayout";
import { UserPlus } from "lucide-react";

const ParticipantsPage = () => {
  const { participants: participantsData, isLoading, error, refetch } = useParticipants();
  
  // Ensure participants have the correct type
  const participants: ParticipantProfileData[] = participantsData.map(p => {
    let identification = p.identification;
    if (identification && typeof identification === 'string') {
      try {
        identification = JSON.parse(identification);
      } catch (e) {
        console.error('Error parsing identification:', e);
        identification = null;
      }
    }
    
    // Transform to ParticipantProfileData format
    return {
      id: p.id,
      first_name: p.first_name || "",
      last_name: p.last_name || "",
      email: p.email || "",
      phone: p.phone || "",
      whatsapp_number: p.whatsapp_number || "",
      date_of_birth: p.date_of_birth || "",
      place_of_birth: p.place_of_birth || "",
      nationality: p.nationality || "",
      gender: p.gender || "",
      address: p.address || "",
      city: p.city || "",
      postal_code: p.postal_code || "",
      country: p.country || "",
      iban: p.iban || "",
      role: p.role,
      identification: identification ? {
        type: identification.type === "passport" || identification.type === "IDcard" ? identification.type : null,
        social_number: identification.social_number || "",
        document_number: identification.document_number || ""
      } : {
        type: null,
        social_number: "",
        document_number: ""
      },
      created_at: p.created_at,
      updated_at: p.updated_at
    } as ParticipantProfileData;
  });

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantProfileData | null>(null);
  const [selectedParticipantUserId, setSelectedParticipantUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch participant profile data when editing
  const { profile: participantProfile, isLoading: isLoadingProfile } = useParticipantProfile(
    isEditMode && selectedParticipantUserId ? selectedParticipantUserId : undefined
  );

  // Get the initial form data for editing - use the fetched profile data if available
  const initialFormData = isEditMode ? (participantProfile || selectedParticipant) : undefined;

  const handleEdit = (participant: ParticipantProfileData) => {
    console.log("Participants - Editing participant:", participant);
    console.log("Participants - Using user_id for profile fetch:", participant.id);
    
    setSelectedParticipant(participant);
    setSelectedParticipantUserId(participant.id); // This is the user_id from participants_profile
    setIsEditMode(true);
    setIsFormDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedParticipant(null);
    setSelectedParticipantUserId(null);
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
    } catch (error) {
      console.error("Error in deleteParticipant:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete participant';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = (formData: ParticipantProfileData) => {
    setIsFormDialogOpen(false);
    setSelectedParticipant(null);
    setSelectedParticipantUserId(null);
    refetch();
  };

  const handleDialogClose = (open: boolean) => {
    setIsFormDialogOpen(open);
    if (!open) {
      setSelectedParticipant(null);
      setSelectedParticipantUserId(null);
    }
  };

  console.log("Participants page loaded");
  console.log("Participants data:", participants);
  console.log("Selected participant for edit:", selectedParticipant);
  console.log("Participant profile data:", participantProfile);

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
          />
        )}

        <Dialog open={isFormDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Participant' : 'Add New Participant'}</DialogTitle>
            </DialogHeader>
            {isLoadingProfile && isEditMode ? (
              <div className="flex justify-center p-8">
                <Spinner size="lg" />
                <span className="ml-2">Loading participant data...</span>
              </div>
            ) : (
              <ParticipantForm
                isEditMode={isEditMode}
                initialData={initialFormData}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsFormDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PropertyLayout>
  );
};

export default ParticipantsPage;
