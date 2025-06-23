
import { ParticipantProfileData } from "@/types/participant";
import { ParticipantProfileDisplay } from "./ParticipantProfileDisplay";
import { ParticipantProfileForm } from "./ParticipantProfileForm";
import { useParticipantProfileData } from "./hooks/useParticipantProfileData";
import { useParticipantProfileActions } from "./hooks/useParticipantProfileActions";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ParticipantProfileCardProps {
  participant: ParticipantProfileData;
  onUpdateProfile?: (updatedData: Partial<ParticipantProfileData>) => Promise<void>;
  inSidebar?: boolean;
}

export function ParticipantProfileCard({ participant, onUpdateProfile, inSidebar = false }: ParticipantProfileCardProps) {
  console.log("ParticipantProfileCard - Participant data received:", participant);
  
  const [editingParticipant, setEditingParticipant] = useState<ParticipantProfileData | null>(null);
  
  if (!participant) {
    console.log("ParticipantProfileCard - No participant data, returning null");
    return null;
  }

  const {
    formData,
    setFormData,
    displayName,
    isLoadingProfile
  } = useParticipantProfileData(participant);

  const {
    isUpdating,
    handleSubmit
  } = useParticipantProfileActions(participant.id, onUpdateProfile);

  const handleFormSubmit = async (e: React.FormEvent, submitFormData: any) => {
    console.log("ParticipantProfileCard - Form submit with data:", submitFormData);
    await handleSubmit(e, submitFormData);
    setEditingParticipant(null);
  };

  console.log("ParticipantProfileCard - Form data from hook:", formData);

  if (inSidebar) {
    return (
      <>
        <div className="px-2 py-3 rounded bg-primary-foreground/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-white/70 truncate">
                {participant.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingParticipant(participant)}
              className="text-white hover:bg-white/10"
            >
              Edit
            </Button>
          </div>
        </div>
        {editingParticipant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingParticipant(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              <ParticipantProfileForm
                participant={editingParticipant}
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleFormSubmit}
                onCancel={() => setEditingParticipant(null)}
                isUpdating={isUpdating}
                inSidebar={true}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <ParticipantProfileDisplay
        participant={participant}
        displayName={displayName}
        phone={formData.phone || participant.phone}
        onEditClick={() => setEditingParticipant(participant)}
      />
      {editingParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingParticipant(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>
            <ParticipantProfileForm
              participant={editingParticipant}
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditingParticipant(null)}
              isUpdating={isUpdating}
            />
          </div>
        </div>
      )}
    </>
  );
}
