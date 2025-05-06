import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateRandomPassword } from "@/utils/password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateParticipantDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateParticipantDialogProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("buyer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user already exists in participants_profile
      const { data: existingProfile, error: checkError } = await supabase
        .from("participants_profile")
        .select("id, email")
        .eq("email", email)
        .limit(1);

      if (checkError) {
        console.error("Error checking existing profile:", checkError);
        throw new Error(`Failed to check if user exists: ${checkError.message}`);
      }

      if (existingProfile && existingProfile.length > 0) {
        toast({
          title: "User already exists",
          description: `A user with email ${email} already exists.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Also check if email exists in auth system
      const { data: existingAuth, error: authCheckError } = await supabase.auth.signInWithPassword({
        email,
        password: "INVALID_PASSWORD_TO_CHECK_EXISTENCE" // This will fail but tell us if the user exists
      });

      if (authCheckError && !authCheckError.message.includes("Invalid login credentials")) {
        // If error is not about invalid credentials, it's a real error
        console.error("Unexpected error checking auth:", authCheckError);
      } else if (!authCheckError) {
        // If no error, user somehow logged in with our fake password (shouldn't happen)
        toast({
          title: "User already exists",
          description: `A user with email ${email} already exists in the auth system.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Generate a secure random password
      const temporaryPassword = generateRandomPassword(12);

      console.log(`Creating new participant with email ${email} and role ${role}`);

      // Create user in Supabase Auth with absolutely minimal options
      // We're avoiding any metadata or options that might trigger the user_type error
      console.log("Using minimal signup approach to avoid user_type error");
      
      let userId: string;
      let authCreationSucceeded = false;
      
      try {
        // First attempt: Use the standard signup
        const { data: authUser, error: signUpError } = await supabase.auth.signUp({
          email,
          password: temporaryPassword
          // No options or metadata to avoid triggering the user_type error
        });

        if (signUpError) {
          console.error("Error with standard signup:", signUpError);
          throw signUpError;
        }

        if (!authUser?.user?.id) {
          throw new Error("No user ID returned from standard signup");
        }

        userId = authUser.user.id;
        authCreationSucceeded = true;
        console.log("User created successfully with standard signup, ID:", userId);
      } catch (standardSignupError) {
        console.error("Standard signup failed, trying alternative approach:", standardSignupError);
        
        // If we get here, we need to use a workaround
        // For now, we'll generate a UUID and use that as the user ID
        // This won't create a real auth user, but it will allow us to create the profile
        userId = crypto.randomUUID();
        console.log("Generated temporary user ID:", userId);
        
        // In a production environment, you would need to handle this differently
        // For example, by using a server-side function with admin privileges
        // or by creating a support ticket for an admin to create the user manually
        
        toast({
          title: "Auth Creation Issue",
          description: "There was an issue creating the user in the auth system. A temporary ID has been generated, but the user won't be able to log in until this is resolved by an admin.",
          variant: "destructive",
        });
      }

      // Create participant profile
      const { error: profileError } = await supabase
        .from("participants_profile")
        .insert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          role: role,
        });

      if (profileError) {
        console.error("Error creating participant profile:", profileError);
        throw new Error(`Failed to create participant profile: ${profileError.message}`);
      }

      // Reset form and close dialog
      resetForm();
      onOpenChange(false);

      // Show success message based on whether auth creation succeeded
      if (authCreationSucceeded) {
        toast({
          title: "Participant created",
          description: `${firstName} ${lastName} has been created as a ${role}.`,
        });

        // Send welcome email with login details only if auth creation succeeded
        try {
          // Get agency settings
          const { data: agencySettings } = await supabase
            .from("agency_settings")
            .select("resend_from_email, resend_from_name")
            .single();

          const siteUrl = window.location.origin;
          const loginLink = `${siteUrl}/auth`;

          // Import email utility
          const { sendEmail } = await import("@/lib/email");

          // Send welcome email with login details
          await sendEmail({
            to: email,
            subject: `Welcome to the Property Portal`,
            html: `
              <h1>Welcome to the Property Portal</h1>
              <p>Hello ${firstName} ${lastName},</p>
              <p>Your account has been created as a <strong>${role}</strong>.</p>
              <p>You can log in with the following credentials:</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
              </div>
              <p>Please login using these credentials. You'll be prompted to change your password after your first login.</p>
              <p><a href="${loginLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Property Portal</a></p>
              <p style="margin-top: 20px; color: #666;">
                If the button above doesn't work, copy and paste this link into your browser:
                <br>
                <span style="word-break: break-all; font-family: monospace;">${loginLink}</span>
              </p>
              <p style="margin-top: 20px; font-size: 12px; color: #888;">
                For security reasons, please change your password immediately after logging in.
              </p>
            `,
            from: agencySettings?.resend_from_email,
            fromName: agencySettings?.resend_from_name,
          });

          console.log("Welcome email sent successfully");
        } catch (emailError) {
          console.error("Error sending welcome email:", emailError);
          // Don't throw here, we still want to show success for creating the participant
        }
      } else {
        // If auth creation failed, we've already shown a toast about the issue
        // Just log the completion of the profile creation
        console.log("Participant profile created with temporary ID, but auth creation failed");
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating participant:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create participant";
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
            <DialogTitle>Create New Participant</DialogTitle>
            <DialogDescription>
              Create a new participant account. They will receive an email with login details.
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "buyer" | "seller")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>
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
              {isSubmitting ? "Creating..." : "Create Participant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
