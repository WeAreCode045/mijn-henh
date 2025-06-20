
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types/user";

interface UserProfileFormProps {
  user: User;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    whatsapp_number: string;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isUpdating: boolean;
  inSidebar?: boolean;
}

export function UserProfileForm({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  onCancel, 
  isUpdating,
  inSidebar = false 
}: UserProfileFormProps) {
  const idPrefix = inSidebar ? "sidebar-" : "";

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}first-name`}>First Name</Label>
        <Input
          id={`${idPrefix}first-name`}
          value={formData.first_name}
          onChange={(e) => onFormDataChange({ ...formData, first_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}last-name`}>Last Name</Label>
        <Input
          id={`${idPrefix}last-name`}
          value={formData.last_name}
          onChange={(e) => onFormDataChange({ ...formData, last_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}email`}>Email</Label>
        <Input
          id={`${idPrefix}email`}
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}phone`}>Phone</Label>
        <Input
          id={`${idPrefix}phone`}
          value={formData.phone}
          onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}whatsapp`}>WhatsApp Number</Label>
        <Input
          id={`${idPrefix}whatsapp`}
          value={formData.whatsapp_number}
          onChange={(e) => onFormDataChange({ ...formData, whatsapp_number: e.target.value })}
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
