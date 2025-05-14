
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantRole } from "@/types/participant";

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
  const [isLoading, setIsLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [createNew, setCreateNew] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "tempPassword123", // Default password for new users
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let userId;
      let accountId;
      
      if (createNew) {
        // Validate required fields for new user
        if (!formData.email || !formData.firstName || !formData.lastName) {
          throw new Error("All fields are required for creating a new user");
        }
        
        // Create new auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            },
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Failed to create user");
        
        userId = authData.user.id;
        
        // Create account with type participant
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .insert({
            user_id: userId,
            type: 'participant',
            role: role as any, // Type coercion needed due to schema constraints
            display_name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email // Add email to the accounts table
          })
          .select()
          .single();
        
        if (accountError) throw accountError;
        if (!accountData) throw new Error("Failed to create account");
        
        accountId = accountData.id;
        
        // Create participant profile
        const { error: profileError } = await supabase
          .from('participants_profile')
          .insert([
            {
              id: accountId,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              role: role
            }
          ]);
        
        if (profileError) throw profileError;
      } else {
        // Validate search email
        if (!searchEmail) {
          throw new Error("Email is required for finding existing users");
        }
        
        // Search for existing user by email
        const { data: userData, error: userError } = await supabase
          .from('accounts')
          .select('user_id, id')
          .eq('email', searchEmail.toLowerCase())
          .eq('type', 'participant')
          .limit(1);
        
        if (userError) throw userError;
        
        if (!userData || userData.length === 0) {
          throw new Error("No participant found with that email");
        }
        
        userId = userData[0].user_id;
        accountId = userData[0].id;
      }
      
      // Link the user to the property as a participant
      const { error: linkError } = await supabase
        .from("property_participants")
        .insert({
          property_id: propertyId,
          user_id: userId,
          role: role,
          status: "pending"
        });
        
      if (linkError) throw linkError;
      
      toast({
        title: "Success",
        description: `${role} added successfully`,
      });
      
      // Reset form and close dialog
      setSearchEmail("");
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        password: "tempPassword123",
      });
      setCreateNew(true);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding participant:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add participant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add {role === "seller" ? "Seller" : "Buyer"} to Property
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <RadioGroup
              defaultValue="new"
              value={createNew ? "new" : "existing"}
              onValueChange={(value) => setCreateNew(value === "new")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="cursor-pointer">
                  Create new {role}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="cursor-pointer">
                  Add existing user as {role}
                </Label>
              </div>
            </RadioGroup>

            {createNew ? (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="searchEmail">Email *</Label>
                <Input
                  id="searchEmail"
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  required
                  placeholder="Search for existing user by email"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Participant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
