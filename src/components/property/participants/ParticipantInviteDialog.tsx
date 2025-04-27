
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePropertyParticipants } from "@/hooks/usePropertyParticipants";
import { ParticipantRole } from "@/types/participant";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { sendEmail } from "@/lib/email";

interface ParticipantInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  role: ParticipantRole;
}

export function ParticipantInviteDialog({
  open,
  onOpenChange,
  propertyId,
  role,
}: ParticipantInviteDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addParticipant } = usePropertyParticipants(propertyId);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First add participant
      const result = await addParticipant({
        email,
        role,
        propertyId,
      });
      
      // Then get the property details to send in the invitation
      const { data: property } = await supabase
        .from('properties')
        .select('title, agent_id')
        .eq('id', propertyId)
        .single();
      
      if (!property) {
        throw new Error("Property not found");
      }
      
      // Get agency settings directly, we don't need to go through the agent profile
      const { data: agencySettings } = await supabase
        .from('agency_settings')
        .select('resend_from_email, resend_from_name')
        .single();
      
      const siteUrl = window.location.origin;
      const inviteLink = `${siteUrl}/auth?email=${encodeURIComponent(email)}&redirect=/participant`;
      
      // Send initial invitation email using agency settings if available
      await sendEmail({
        to: email,
        subject: `You've been invited as a ${role} for ${property.title || 'a property'}`,
        html: `
          <h1>Property Invitation</h1>
          <p>You have been invited to participate as a <strong>${role}</strong> for ${property.title || 'a property'}.</p>
          <p>Please login to your account or create a new one to view this property.</p>
          <p>If this is your first time, you'll need to set your password first.</p>
          <p><a href="${inviteLink}">Set Password & Access Property Portal</a></p>
          <p><small>If you already have an account, simply log in to access your property.</small></p>
          <p style="margin-top: 20px; color: #666;">
            If the button above doesn't work, copy and paste this link into your browser:
            <br>
            <span style="word-break: break-all; font-family: monospace;">${inviteLink}</span>
          </p>
        `,
        from: agencySettings?.resend_from_email,
        fromName: agencySettings?.resend_from_name
      });
      
      setEmail("");
      onOpenChange(false);
      
      toast({
        title: "Invitation sent",
        description: `${role} invitation has been sent to ${email}`,
      });
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to add ${role}`,
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
              Enter the email address to invite a {role} to this property.
              If they already have an account, they will be connected directly.
              Otherwise, a new account will be created for them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="email@example.com"
                required
              />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
