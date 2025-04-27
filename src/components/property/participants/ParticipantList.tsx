import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PropertyParticipant } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ParticipantInviteDialog } from "./ParticipantInviteDialog";
import { usePropertyParticipants } from "@/hooks/usePropertyParticipants";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParticipantListProps {
  propertyId: string;
  title: string;
  role: 'seller' | 'buyer';
}

export function ParticipantList({ propertyId, title, role }: ParticipantListProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { participants, isLoading, removeParticipant, updateParticipantStatus, resendInvite } = usePropertyParticipants(propertyId);
  const { toast } = useToast();

  // Filter participants by role
  const filteredParticipants = participants?.filter(p => p.role === role) || [];
  
  const handleResendInvite = async (participantId: string, email: string) => {
    try {
      await resendInvite(participantId);
      toast({
        title: "Success",
        description: `Invitation resent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100">Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-100">Active</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-100">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button 
          size="sm" 
          onClick={() => setInviteDialogOpen(true)}
        >
          Add {role === 'seller' ? 'Seller' : 'Buyer'}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredParticipants.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
          No {role === 'seller' ? 'sellers' : 'buyers'} added yet.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.user?.full_name || 'Unknown'}</TableCell>
                  <TableCell>{participant.user?.email || 'Unknown'}</TableCell>
                  <TableCell>{getStatusBadge(participant.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {participant.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateParticipantStatus({
                              participantId: participant.id,
                              status: 'active'
                            })}
                          >
                            Activate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => participant.user?.email && handleResendInvite(participant.id, participant.user.email)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Resend
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeParticipant(participant.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <ParticipantInviteDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen}
        propertyId={propertyId}
        role={role}
      />
    </div>
  );
}
