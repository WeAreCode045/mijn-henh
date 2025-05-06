import { useState, useEffect } from "react";
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
import { usePropertyParticipants } from "@/hooks/usePropertyParticipants";
import { ParticipantRole } from "@/types/participant";
import { supabase } from "@/integrations/supabase/client";
import { sendEmail } from "@/lib/email";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface ParticipantSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  role: ParticipantRole;
}

interface ParticipantOption {
  value: string;
  label: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function ParticipantSelectDialog({
  open,
  onOpenChange,
  propertyId,
  role,
}: ParticipantSelectDialogProps) {
  const [participants, setParticipants] = useState<ParticipantOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [openCombobox, setOpenCombobox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addParticipant } = usePropertyParticipants(propertyId);
  const { toast } = useToast();

  // Fetch all participants when dialog opens
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!open) return;
      
      setIsLoading(true);
      try {
        // Get all participant profiles
        const { data, error } = await supabase
          .from("participants_profile")
          .select("id, first_name, last_name, email")
          .order("last_name", { ascending: true });

        if (error) {
          throw error;
        }

        // Transform data into options format
        const options = data.map((participant) => ({
          value: participant.id,
          label: `${participant.first_name || ""} ${participant.last_name || ""} (${participant.email})`,
          email: participant.email || "",
          firstName: participant.first_name || "",
          lastName: participant.last_name || "",
        }));

        setParticipants(options);
      } catch (error) {
        console.error("Error fetching participants:", error);
        toast({
          title: "Error",
          description: "Failed to load participants",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const participant = participants.find(p => p.value === selectedParticipant);
      
      if (!participant) {
        throw new Error("Selected participant not found");
      }
      
      console.log(`Adding ${role} with ID ${selectedParticipant} to property ${propertyId}`);
      
      // Add participant to the property
      await addParticipant({
        email: participant.email,
        firstName: participant.firstName,
        lastName: participant.lastName,
        role,
        propertyId,
      });
      
      // Get property details for the invitation
      const { data: property } = await supabase
        .from('properties')
        .select('title, agent_id')
        .eq('id', propertyId)
        .single();
      
      if (!property) {
        throw new Error("Property not found");
      }
      
      // Get agency settings
      const { data: agencySettings } = await supabase
        .from('agency_settings')
        .select('resend_from_email, resend_from_name')
        .single();
      
      const siteUrl = window.location.origin;
      const inviteLink = `${siteUrl}/auth?redirect=/participant`;
      
      // Send invitation email
      await sendEmail({
        to: participant.email,
        subject: `You've been invited as a ${role} for ${property.title || 'a property'}`,
        html: `
          <h1>Property Invitation</h1>
          <p>Hello ${participant.firstName} ${participant.lastName},</p>
          <p>You have been invited to participate as a <strong>${role}</strong> for ${property.title || 'a property'}.</p>
          <p>You can access this property using your existing account credentials.</p>
          <p><a href="${inviteLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Property Portal</a></p>
          <p style="margin-top: 20px; color: #666;">
            If the button above doesn't work, copy and paste this link into your browser:
            <br>
            <span style="word-break: break-all; font-family: monospace;">${inviteLink}</span>
          </p>
        `,
        from: agencySettings?.resend_from_email,
        fromName: agencySettings?.resend_from_name
      });
      
      // Reset form and close dialog
      setSelectedParticipant("");
      onOpenChange(false);
      
      toast({
        title: "Invitation sent",
        description: `${role} invitation has been sent to ${participant.email}`,
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      const errorMessage = error instanceof Error ? error.message : `Failed to add ${role}`;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add {role === "seller" ? "Seller" : "Buyer"}
            </DialogTitle>
            <DialogDescription>
              Select an existing participant to invite as a {role} to this property.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="participant" className="text-right">
                Participant
              </Label>
              <div className="col-span-3">
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCombobox}
                      className="w-full justify-between"
                      disabled={isLoading}
                    >
                      {selectedParticipant
                        ? participants.find((participant) => participant.value === selectedParticipant)?.label
                        : isLoading
                        ? "Loading participants..."
                        : "Select participant..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search participants..." />
                      <CommandEmpty>No participant found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {participants.map((participant) => (
                          <CommandItem
                            key={participant.value}
                            value={participant.value}
                            onSelect={(currentValue) => {
                              setSelectedParticipant(
                                currentValue === selectedParticipant ? "" : currentValue
                              );
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedParticipant === participant.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {participant.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedParticipant}>
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
