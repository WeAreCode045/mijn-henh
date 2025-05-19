
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParticipants } from "@/hooks/useParticipants";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { ParticipantProfileData } from "@/types/participant";
import { usePropertyParticipants } from "@/hooks/usePropertyParticipants";
import { Badge } from "@/components/ui/badge";

interface ParticipantSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  role: 'buyer' | 'seller';
}

export function ParticipantSelectDialog({
  open,
  onOpenChange,
  propertyId,
  role
}: ParticipantSelectDialogProps) {
  const { participants, isLoading } = useParticipants();
  const { participants: propertyParticipants, addParticipant } = usePropertyParticipants(propertyId);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantProfileData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (participant: ParticipantProfileData) => {
    setSelectedParticipant(participant);
  };

  const handleConfirm = async () => {
    if (!selectedParticipant) return;
    
    try {
      await addParticipant.mutateAsync({
        email: selectedParticipant.email,
        firstName: selectedParticipant.first_name,
        lastName: selectedParticipant.last_name,
        role,
        propertyId
      });
      
      onOpenChange(false);
      setSelectedParticipant(null);
    } catch (error) {
      console.error("Error adding participant:", error);
      // Error is already handled in the useMutation configuration
    }
  };

  // Filter out participants already assigned to this property in the same role
  const existingParticipantIds = propertyParticipants
    .filter(p => p.role === role)
    .map(p => p.user_id);

  const filteredParticipants = participants.filter(participant => {
    // Filter by search term
    const displayName = 
      (participant.full_name ? participant.full_name : 
      `${participant.first_name || ''} ${participant.last_name || ''}`).trim();
    
    const matchesSearch = 
      !searchTerm ||
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (participant.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter out already assigned participants
    const isNotAssigned = !existingParticipantIds.includes(participant.id);
    
    return matchesSearch && isNotAssigned;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select {role === 'buyer' ? 'a Buyer' : 'a Seller'}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full px-3 py-2 border rounded-md mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="border rounded-md max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Loading participants...
                    </TableCell>
                  </TableRow>
                ) : filteredParticipants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No participants found. Create a new participant first.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParticipants.map((participant) => (
                    <TableRow 
                      key={participant.id}
                      className={selectedParticipant?.id === participant.id ? "bg-blue-50" : ""}
                      onClick={() => handleSelect(participant)}
                    >
                      <TableCell>
                        {(participant.full_name ? participant.full_name :
                         `${participant.first_name || ''} ${participant.last_name || ''}`).trim() || 
                         '-'}
                      </TableCell>
                      <TableCell>{participant.email || ''}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{participant.role || "Participant"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSelect(participant)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedParticipant || addParticipant.isPending}
          >
            {addParticipant.isPending ? "Adding..." : "Add Participant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
