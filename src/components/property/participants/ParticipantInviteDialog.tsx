
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
import { generateRandomPassword } from "@/utils/password";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addParticipant } = usePropertyParticipants(propertyId);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log(`Adding ${role} with email ${email} to property ${propertyId}`);
      
      // Generate a random password for the new user
      const temporaryPassword = generateRandomPassword(12);
      
      // First add participant with first and last name
      const result = await addParticipant({
        email,
        firstName,
        lastName,
        role,
        propertyId,
        temporaryPassword,
      });
      
      console.log("Participant added result:", result);
      
      // Then get the property details to send in the invitation
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
      // More secure invite link without email in URL
      const inviteLink = `${siteUrl}/auth?redirect=/participant`;
      
      // Send initial invitation email with login details
      await sendEmail({
        to: email,
        subject: `You've been invited as a ${role} for ${property.title || 'a property'}`,
        html: `
          <h1>Property Invitation</h1>
          <p>Hello ${firstName} ${lastName},</p>
          <p>You have been invited to participate as a <strong>${role}</strong> for ${property.title || 'a property'}.</p>
          <p>We've created an account for you with the following details:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
          </div>
          <p>Please login using these credentials. You'll be prompted to change your password after your first login.</p>
          <p><a href="${inviteLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Property Portal</a></p>
          <p style="margin-top: 20px; color: #666;">
            If the button above doesn't work, copy and paste this link into your browser:
            <br>
            <span style="word-break: break-all; font-family: monospace;">${inviteLink}</span>
          </p>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">
            For security reasons, please change your password immediately after logging in.
          </p>
        `,
        from: agencySettings?.resend_from_email,
        fromName: agencySettings?.resend_from_name
      });
      
      // Reset form fields
      setEmail("");
      setFirstName("");
      setLastName("");
      onOpenChange(false);
      
      toast({
        title: "Invitation sent",
        description: `${role} invitation has been sent to ${email} with login details`,
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
              Enter the email address to invite a {role} to this property.
              If they already have an account, they will be connected directly.
              Otherwise, a new account will be created for them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
                placeholder="John"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
                placeholder="Doe"
                required
              />
            </div>
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
