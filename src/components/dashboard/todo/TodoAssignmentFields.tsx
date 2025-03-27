
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePropertiesSelect } from "@/hooks/usePropertiesSelect";
import { useUsers } from "@/hooks/useUsers";
import { Label } from "@/components/ui/label";

export interface TodoAssignmentFieldsProps {
  assignedToId: string;
  propertyId: string;
  onAssignedToChange: (value: string) => void;
  onPropertyChange: (value: string) => void;
}

export function TodoAssignmentFields({
  assignedToId,
  propertyId,
  onAssignedToChange,
  onPropertyChange
}: TodoAssignmentFieldsProps) {
  const { properties, isLoading: propertiesLoading } = usePropertiesSelect();
  const { users, refetch } = useUsers();
  // Since isLoading is missing, we'll set a default false value
  const usersLoading = false;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="assigned-to">Toegewezen aan</Label>
        <Select
          value={assignedToId}
          onValueChange={onAssignedToChange}
          disabled={usersLoading}
        >
          <SelectTrigger id="assigned-to">
            <SelectValue placeholder="Selecteer gebruiker" />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.full_name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="property">Gerelateerde eigenschap</Label>
        <Select
          value={propertyId}
          onValueChange={onPropertyChange}
          disabled={propertiesLoading}
        >
          <SelectTrigger id="property">
            <SelectValue placeholder="Selecteer eigenschap" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Geen eigenschap</SelectItem>
            {properties?.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
