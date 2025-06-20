
import { useState } from "react";
import { ParticipantFormData, ParticipantRole } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ParticipantProfileData } from "@/types/participant";

interface ParticipantFormProps {
  isEditMode: boolean;
  initialData?: ParticipantProfileData;
  onSuccess: () => void;
}

export function ParticipantForm({ isEditMode, initialData, onSuccess }: ParticipantFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ParticipantFormData>({
    email: initialData?.email || "",
    password: "",
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    phone: initialData?.phone || "",
    whatsapp_number: initialData?.whatsapp_number || "",
    date_of_birth: initialData?.date_of_birth || "",
    place_of_birth: initialData?.place_of_birth || "",
    nationality: initialData?.nationality || "",
    gender: initialData?.gender || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    postal_code: initialData?.postal_code || "",
    country: initialData?.country || "",
    role: (initialData?.role as ParticipantRole) || "buyer",
    iban: initialData?.iban || "",
    identification: initialData?.identification || {
      type: null,
      social_number: "",
      document_number: ""
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode && initialData) {
        console.log("=== EDIT MODE DEBUG ===");
        console.log("Initial data:", initialData);
        console.log("Form data:", formData);

        // Update participants_profile table
        if (initialData.id) {
          console.log("Updating participants_profile for id:", initialData.id);
          
          const updateData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            whatsapp_number: formData.whatsapp_number,
            date_of_birth: formData.date_of_birth || null,
            place_of_birth: formData.place_of_birth,
            nationality: formData.nationality,
            gender: formData.gender,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postal_code,
            country: formData.country,
            iban: formData.iban,
            identification: formData.identification,
            updated_at: new Date().toISOString(),
          };
          
          console.log("Profile update data:", updateData);
          
          const { error: profileError } = await supabase
            .from("participants_profile")
            .update(updateData)
            .eq("id", initialData.id);

          if (profileError) {
            console.error("Error updating participants_profile:", profileError);
            throw new Error(`Failed to update profile: ${profileError.message}`);
          }
          console.log("Successfully updated participants_profile");
        }
        
        // Update accounts table - find account by user_id matching the profile id
        console.log("Updating accounts for user_id:", initialData.id);
        
        const accountUpdateData = {
          role: formData.role,
          display_name: `${formData.first_name} ${formData.last_name}`.trim(),
          email: formData.email,
          updated_at: new Date().toISOString()
        };
        
        console.log("Account update data:", accountUpdateData);
        
        const { error: roleError } = await supabase
          .from("accounts")
          .update(accountUpdateData)
          .eq("user_id", initialData.id);
          
        if (roleError) {
          console.error("Error updating accounts:", roleError);
          throw new Error(`Failed to update account: ${roleError.message}`);
        }
        console.log("Successfully updated accounts");

        toast({
          title: "Success",
          description: "Participant updated successfully",
        });
      } else {
        console.log("Creating new participant with data:", formData);
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password!,
          options: {
            data: {
              full_name: `${formData.first_name} ${formData.last_name}`.trim(),
              phone: formData.phone,
            },
          },
        });

        if (authError) {
          console.error("Auth signup error:", authError);
          throw authError;
        }

        if (authData.user) {
          console.log("User created in auth, user_id:", authData.user.id);

          // Wait a moment for the trigger to complete
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if account was created by trigger, if not create it manually
          const { data: existingAccount } = await supabase
            .from("accounts")
            .select("id")
            .eq("user_id", authData.user.id)
            .single();

          if (!existingAccount) {
            console.log("No account found from trigger, creating manually");
            const { error: accountInsertError } = await supabase
              .from("accounts")
              .insert({
                user_id: authData.user.id,
                role: formData.role,
                type: 'participant',
                display_name: `${formData.first_name} ${formData.last_name}`.trim(),
                email: formData.email,
                status: 'active'
              });

            if (accountInsertError) {
              console.error("Error creating account manually:", accountInsertError);
              throw new Error(`Failed to create account: ${accountInsertError.message}`);
            }
            console.log("Account created manually");
          } else {
            console.log("Account found from trigger, updating it");
            const { error: accountUpdateError } = await supabase
              .from("accounts")
              .update({
                role: formData.role,
                type: 'participant',
                display_name: `${formData.first_name} ${formData.last_name}`.trim(),
                email: formData.email
              })
              .eq("user_id", authData.user.id);

            if (accountUpdateError) {
              console.error("Error updating account:", accountUpdateError);
              throw new Error(`Failed to update account: ${accountUpdateError.message}`);
            }
            console.log("Account updated successfully");
          }

          // Check if participant profile exists, if not create/update it
          const { data: existingProfile } = await supabase
            .from("participants_profile")
            .select("id")
            .eq("id", authData.user.id)
            .single();

          if (!existingProfile) {
            console.log("No participant profile found from trigger, creating manually");
            const { error: profileInsertError } = await supabase
              .from("participants_profile")
              .insert({
                id: authData.user.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                whatsapp_number: formData.whatsapp_number,
                date_of_birth: formData.date_of_birth || null,
                place_of_birth: formData.place_of_birth,
                nationality: formData.nationality,
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
                postal_code: formData.postal_code,
                country: formData.country,
                role: formData.role,
                iban: formData.iban,
                identification: formData.identification
              });

            if (profileInsertError) {
              console.error("Error creating profile manually:", profileInsertError);
              throw new Error(`Failed to create profile: ${profileInsertError.message}`);
            }
            console.log("Profile created manually");
          } else {
            console.log("Profile found from trigger, updating it");
            const { error: profileUpdateError } = await supabase
              .from("participants_profile")
              .update({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                whatsapp_number: formData.whatsapp_number,
                date_of_birth: formData.date_of_birth || null,
                place_of_birth: formData.place_of_birth,
                nationality: formData.nationality,
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
                postal_code: formData.postal_code,
                country: formData.country,
                role: formData.role,
                iban: formData.iban,
                identification: formData.identification,
                updated_at: new Date().toISOString()
              })
              .eq("id", authData.user.id);

            if (profileUpdateError) {
              console.error("Error updating profile:", profileUpdateError);
              throw new Error(`Failed to update profile: ${profileUpdateError.message}`);
            }
            console.log("Profile updated successfully");
          }
        }

        toast({
          title: "Success",
          description: "Participant created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isEditMode}
              required
            />
          </div>

          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: ParticipantRole) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={formData.place_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, place_of_birth: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postal_code}
                onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identificationType">Document Type</Label>
            <Select
              value={formData.identification?.type || ""}
              onValueChange={(value: "passport" | "IDcard") => 
                setFormData(prev => ({ 
                  ...prev, 
                  identification: { ...prev.identification, type: value }
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="IDcard">ID Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="socialNumber">Social Security Number</Label>
              <Input
                id="socialNumber"
                value={formData.identification?.social_number || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  identification: { ...prev.identification, social_number: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number</Label>
              <Input
                id="documentNumber"
                value={formData.identification?.document_number || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  identification: { ...prev.identification, document_number: e.target.value }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={formData.iban}
              onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
              placeholder="Enter IBAN number"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Participant" : "Create Participant")}
      </Button>
    </form>
  );
}
