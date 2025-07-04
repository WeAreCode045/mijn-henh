import { useState } from "react";
import { User, UserFormData } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface EmployeeFormProps {
  isEditMode: boolean;
  initialData?: User;
  onSuccess: () => void;
}

export function EmployeeForm({ isEditMode, initialData, onSuccess }: EmployeeFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || "",
    password: "",
    full_name: initialData?.full_name || "",
    first_name: initialData?.first_name || initialData?.full_name?.split(' ')[0] || "",
    last_name: initialData?.last_name || initialData?.full_name?.split(' ').slice(1).join(' ') || "",
    phone: initialData?.phone || "",
    whatsapp_number: initialData?.whatsapp_number || "",
    role: (initialData?.role as "admin" | "agent") || "agent",
    avatar_url: initialData?.avatar_url || "",
    type: "employee"
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(initialData?.avatar_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (userId: string): Promise<string | null> => {
    if (!photoFile) return null;

    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('agent-photos')
      .upload(filePath, photoFile, {
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('agent-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode && initialData) {
        console.log("=== EDIT MODE DEBUG ===");
        console.log("Initial data:", initialData);
        console.log("Account ID:", initialData.id);
        console.log("User ID:", initialData.user_id);
        console.log("Form data:", formData);

        let photoUrl = null;
        if (photoFile) {
          // Use user_id for photo upload
          if (!initialData.user_id) {
            throw new Error("No user_id available for photo upload");
          }
          photoUrl = await uploadPhoto(initialData.user_id);
          console.log("Photo uploaded:", photoUrl);
        }

        // Update employer_profiles table using user_id
        if (initialData.user_id) {
          console.log("Updating employer_profiles for user_id:", initialData.user_id);
          
          const updateData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            whatsapp_number: formData.whatsapp_number,
            role: formData.role,
            updated_at: new Date().toISOString(),
            ...(photoUrl && { avatar_url: photoUrl })
          };
          
          console.log("Profile update data:", updateData);
          
          const { error: profileError } = await supabase
            .from("employer_profiles")
            .update(updateData)
            .eq("id", initialData.user_id);

          if (profileError) {
            console.error("Error updating employer_profiles:", profileError);
            throw new Error(`Failed to update profile: ${profileError.message}`);
          }
          console.log("Successfully updated employer_profiles");
        } else {
          console.warn("No user_id available for profile update");
        }
        
        // Update accounts table using account.id - THIS IS THE KEY FIX
        console.log("Updating accounts for account.id:", initialData.id);
        
        const accountUpdateData = {
          role: formData.role,
          display_name: `${formData.first_name} ${formData.last_name}`.trim(),
          updated_at: new Date().toISOString()
        };
        
        console.log("Account update data:", accountUpdateData);
        
        const { error: roleError } = await supabase
          .from("accounts")
          .update(accountUpdateData)
          .eq("id", initialData.id);
          
        if (roleError) {
          console.error("Error updating accounts:", roleError);
          throw new Error(`Failed to update account: ${roleError.message}`);
        }
        console.log("Successfully updated accounts");

        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        console.log("Creating new employee with data:", formData);
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
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
          
          let photoUrl = null;
          if (photoFile) {
            photoUrl = await uploadPhoto(authData.user.id);
            console.log("Photo uploaded for new user:", photoUrl);
          }

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
                type: formData.type,
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
                type: formData.type,
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

          // Check if employer profile exists, if not create/update it
          const { data: existingProfile } = await supabase
            .from("employer_profiles")
            .select("id")
            .eq("id", authData.user.id)
            .single();

          if (!existingProfile) {
            console.log("No employer profile found from trigger, creating manually");
            const { error: profileInsertError } = await supabase
              .from("employer_profiles")
              .insert({
                id: authData.user.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                whatsapp_number: formData.whatsapp_number,
                role: formData.role,
                ...(photoUrl && { avatar_url: photoUrl })
              });

            if (profileInsertError) {
              console.error("Error creating profile manually:", profileInsertError);
              throw new Error(`Failed to create profile: ${profileInsertError.message}`);
            }
            console.log("Profile created manually");
          } else {
            console.log("Profile found from trigger, updating it");
            const { error: profileUpdateError } = await supabase
              .from("employer_profiles")
              .update({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                whatsapp_number: formData.whatsapp_number,
                role: formData.role,
                updated_at: new Date().toISOString(),
                ...(photoUrl && { avatar_url: photoUrl })
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
          description: "Employee created successfully",
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

  // Simplified form for creating a new user (only fields required for auth)
  if (!isEditMode) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.first_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, first_name: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.last_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, last_name: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value: "admin" | "agent") =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
            defaultValue="agent"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Employee"}
        </Button>
      </form>
    );
  }

  // Full form for editing an existing user
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={photoPreview} alt="Profile photo" />
            <AvatarFallback>{formData.first_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="max-w-[250px]"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={true}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={formData.first_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, first_name: e.target.value }))
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={formData.last_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, last_name: e.target.value }))
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
        <Input
          id="whatsappNumber"
          type="tel"
          value={formData.whatsapp_number}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, whatsapp_number: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: "admin" | "agent") =>
            setFormData((prev) => ({ ...prev, role: value }))
          }
          defaultValue="agent"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update User"}
      </Button>
    </form>
  );
}
