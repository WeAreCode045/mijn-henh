
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Edit, Trash2 } from "lucide-react";
import { ParticipantProfileData } from "@/types/participant";

interface ParticipantListProps {
  participants: ParticipantProfileData[];
  onEdit: (participant: ParticipantProfileData) => void;
  onDelete: (participantId: string) => void;
  isLoading: boolean;
}

export function ParticipantList({ participants, onEdit, onDelete, isLoading }: ParticipantListProps) {
  console.log("ParticipantList rendering with:", { participants, isLoading });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading participants...</div>
      </div>
    );
  }

  if (!participants || participants.length === 0) {
    return (
      <div className="text-center py-8">
        <UserCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600">No participants found</h3>
        <p className="text-gray-500">Add your first participant to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {participants.map((participant) => (
        <Card key={participant.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {participant.full_name || `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || 'Unnamed Participant'}
                  </h3>
                  <p className="text-sm text-gray-500">{participant.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs capitalize">
                      {participant.role}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Participant
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(participant)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(participant.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            {(participant.phone || participant.city || participant.country) && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
                {participant.phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {participant.phone}
                  </div>
                )}
                {participant.city && (
                  <div>
                    <span className="font-medium">City:</span> {participant.city}
                  </div>
                )}
                {participant.country && (
                  <div>
                    <span className="font-medium">Country:</span> {participant.country}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
