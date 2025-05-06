
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { useParticipants } from "@/hooks/useParticipants";
import { ParticipantProfileData } from "@/types/participant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Eye, UserPlus } from "lucide-react";
import { PropertyLayout } from "@/components/PropertyLayout";
import { Spinner } from "@/components/ui/spinner";
import { CreateParticipantDialog } from "@/components/participants/CreateParticipantDialog";

const Participants = () => {
  const { participants, isLoading, error, refetch } = useParticipants();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantProfileData | null>(null);

  const handleViewProfile = (participant: ParticipantProfileData) => {
    setSelectedParticipant(participant);
    setIsDialogOpen(true);
  };

  console.log("Participants page loaded");
  console.log("Participants data:", participants);

  return (
    <PropertyLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Participants</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
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
        ) : participants.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <UserCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No participants found</h3>
            <p className="text-gray-500 mt-2">Participants will appear here when buyers or sellers are added to properties.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map((participant) => (
              <Card key={participant.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={participant.avatar_url || ""} />
                      <AvatarFallback>
                        <UserCircle className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">
                      {participant.first_name} {participant.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{participant.email}</p>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs mt-2 capitalize">
                      {participant.role}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewProfile(participant)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Participant Profile</DialogTitle>
            </DialogHeader>
            {selectedParticipant && (
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-20 w-20 mb-2">
                    <AvatarImage src={selectedParticipant.avatar_url || ""} />
                    <AvatarFallback>
                      <UserCircle className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">
                    {selectedParticipant.first_name} {selectedParticipant.last_name}
                  </h2>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs mt-1 capitalize">
                    {selectedParticipant.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{selectedParticipant.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{selectedParticipant.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                    <p>{selectedParticipant.whatsapp_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p>{selectedParticipant.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">City</p>
                    <p>{selectedParticipant.city || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p>{selectedParticipant.address || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Create Participant Dialog */}
        <CreateParticipantDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={refetch}
        />
      </div>
    </PropertyLayout>
  );
};

export default Participants;
