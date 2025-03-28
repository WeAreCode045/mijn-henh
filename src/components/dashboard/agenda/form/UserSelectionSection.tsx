
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserSelectionSectionProps {
  additionalUsers: string[];
  setAdditionalUsers: (value: string[]) => void;
  availableUsers: { id: string; name: string }[];
  usersLoading: boolean;
}

export function UserSelectionSection({
  additionalUsers,
  setAdditionalUsers,
  availableUsers,
  usersLoading,
}: UserSelectionSectionProps) {
  const handleRemoveUser = (userId: string) => {
    setAdditionalUsers(additionalUsers.filter(id => id !== userId));
  };

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="users" className="text-right">
        Share with
      </Label>
      <div className="col-span-3">
        {usersLoading ? (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading users...</span>
          </div>
        ) : availableUsers.length > 0 ? (
          <>
            <Select
              onValueChange={(value) => {
                if (!additionalUsers.includes(value)) {
                  setAdditionalUsers([...additionalUsers, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select users to share with" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    disabled={additionalUsers.includes(user.id)}
                  >
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Display selected users as badges */}
            {additionalUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {additionalUsers.map((userId) => {
                  const user = availableUsers.find((u) => u.id === userId);
                  return (
                    <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                      {user?.name || "User"}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveUser(userId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            No other users available to share with
          </div>
        )}
      </div>
    </div>
  );
}
