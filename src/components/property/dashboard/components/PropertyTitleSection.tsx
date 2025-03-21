
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

interface PropertyTitleSectionProps {
  title: string;
  address: string;
  isEditing: boolean;
  setTitle: (title: string) => void;
  setAddress: (address: string) => void;
  toggleEditMode: () => void;
  addressInputRef: React.RefObject<HTMLInputElement>;
}

export function PropertyTitleSection({ 
  title, 
  address, 
  isEditing, 
  setTitle, 
  setAddress, 
  toggleEditMode,
  addressInputRef 
}: PropertyTitleSectionProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">Title</label>
            <div className="flex items-center gap-2">
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Property Title"
                className="text-xl font-semibold"
              />
            </div>
          </div>
        ) : (
          <h3 className="text-xl font-semibold">{title || "Untitled Property"}</h3>
        )}
        
        {!isEditing && (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={toggleEditMode}
            title="Edit Property Information"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Address</label>
            <Input 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Property Address"
              ref={addressInputRef}
            />
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground mb-4">{address || "No address specified"}</p>
      )}
    </div>
  );
}
