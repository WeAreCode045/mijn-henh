
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ParticipantRole } from "@/types/participant";
import { useToast } from "@/components/ui/use-toast";
import { useParticipants } from "@/hooks/useParticipants";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface ParticipantSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  role: ParticipantRole;
}

export function ParticipantSelectDialog({
  open,
  onOpenChange,
  propertyId,
  role,
}: ParticipantSelectDialogProps) {
  const { toast } = useToast();
  const { participants, isLoading } = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedParticipant) {
      toast({
        title: "Error",
        description: "Please select a participant",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Add the selected participant to the property
      const { error } = await supabase
        .from('property_participants')
        .insert({
          property_id: propertyId,
          user_id: selectedParticipant,
          role: role,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${role === 'seller' ? 'Seller' : 'Buyer'} added successfully`,
      });

      onOpenChange(false);
      
      // Optionally trigger a page refresh to show the new participant
      window.location.reload();
    } catch (error: any) {
      console.error("Error adding participant:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add participant",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to create and invite a new participant
  const createAndInviteParticipant = async (participantData: {
    email: string;
    firstName: string;
    lastName: string;
    role: ParticipantRole;
    propertyId: string;
  }) => {
    try {
      // This would typically be handled by a backend API endpoint
      // For demo purposes, we're showing the flow here
      
      // 1. Create user in auth system
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: participantData.email,
        password: "tempPassword123", // Should be randomly generated
        options: {
          data: {
            full_name: `${participantData.firstName} ${participantData.lastName}`,
          },
        },
      });

      if (authError) throw authError;
      
      // 2. Create account for this user 
      if (authData.user) {
        const userId = authData.user.id;
        
        // Add to property_participants
        const { error: participantError } = await supabase
          .from('property_participants')
          .insert({
            property_id: participantData.propertyId,
            user_id: userId,
            role: participantData.role,
            status: 'pending'
          });
          
        if (participantError) throw participantError;
      }
      
      // Success
      return { success: true };
    } catch (error: any) {
      console.error("Error creating participant:", error);
      return { success: false, error };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select {role === "seller" ? "Seller" : "Buyer"}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
            <span className="ml-2">Loading participants...</span>
          </div>
        ) : participants && participants.length > 0 ? (
          <div className="my-4 max-h-[400px] overflow-y-auto">
            <RadioGroup 
              value={selectedParticipant || ""} 
              onValueChange={setSelectedParticipant}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>
                        <RadioGroupItem 
                          value={participant.id} 
                          id={`participant-${participant.id}`} 
                        />
                      </TableCell>
                      <TableCell>
                        <Label htmlFor={`participant-${participant.id}`} className="cursor-pointer">
                          {participant.first_name} {participant.last_name}
                        </Label>
                      </TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>{participant.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </RadioGroup>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No participants found. Create a new participant first.</p>
          </div>
        )}
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={!selectedParticipant || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Adding...
              </>
            ) : (
              `Add ${role === "seller" ? "Seller" : "Buyer"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
