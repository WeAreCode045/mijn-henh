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
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserFormProps {
  isEditMode: boolean;
  initialData?: User;
  onSuccess: () => void;
}

export function UserForm({ isEditMode, initialData, onSuccess }: UserFormProps) {
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
    type: "employee" // Adding required type field
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
      if (isEditMode && initialData?.id) {
        let photoUrl = null;
        if (photoFile) {
          photoUrl = await uploadPhoto(initialData.id);
        }

        // Update employer_profiles table
        const { error: profileError } = await supabase
          .from("employer_profiles")
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            whatsapp_number: formData.whatsapp_number,
            updated_at: new Date().toISOString(),
            ...(photoUrl && { avatar_url: photoUrl }),
            // Only update role if it's not empty or null
            ...(formData.role && { role: formData.role })
          })
          .eq("id", initialData.id);

        if (profileError) throw profileError;
        
        // Update role in accounts table if role is provided
        if (formData.role) {
          const { error: roleError } = await supabase
            .from("accounts")
            .update({
              role: formData.role,
              updated_at: new Date().toISOString()
            })
            .eq("id", initialData.id);
            
          if (roleError) throw roleError;
        }

        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        if (!formData.email || !formData.password) {
          throw new Error("Email and password are required");
        }
        
        // Step 1: Create new user in auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: `${formData.first_name} ${formData.last_name}`.trim(),
            },
          },
        });

        if (authError) throw authError;

        if (!authData.user) {
          throw new Error("Failed to create user");
        }
        
        // Step 2: Create account entry for the user with type employee
        const { data: accountData, error: accountError } = await supabase
          .from("accounts")
          .insert({
            user_id: authData.user.id,
            type: "employee",
            role: "agent", // Default role required by schema
            display_name: `${formData.first_name} ${formData.last_name}`.trim(),
          })
          .select()
          .single();

        if (accountError) {
          console.error("Error creating account:", accountError);
          throw accountError;
        }

        if (!accountData) {
          throw new Error("Failed to create account");
        }

        // Upload photo if provided
        let photoUrl = null;
        if (photoFile) {
          photoUrl = await uploadPhoto(accountData.id);
        }

        // Create employer profile
        const { error: profileError } = await supabase
          .from("employer_profiles")
          .insert({
            id: accountData.id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            whatsapp_number: formData.whatsapp_number,
            ...(photoUrl && { avatar_url: photoUrl })
            // Note: not setting role here as per request
          });

        if (profileError) throw profileError;
        
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
        description: error.message,
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
          <Label htmlFor="email">Email *</Label>
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
          <Label htmlFor="password">Password *</Label>
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
          <Label htmlFor="firstName">First Name *</Label>
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
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.last_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, last_name: e.target.value }))
            }
            required
          />
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
        <Label htmlFor="firstName">First Name *</Label>
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
        <Label htmlFor="lastName">Last Name *</Label>
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
