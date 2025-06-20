
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCircle, PenSquare } from "lucide-react";
import { User } from "@/types/user";

interface UserProfileSidebarProps {
  user: User;
  displayName: string;
  onEditClick: () => void;
}

export function UserProfileSidebar({ user, displayName, onEditClick }: UserProfileSidebarProps) {
  return (
    <div className="flex items-center space-x-3 p-1">
      <Avatar className="h-10 w-10">
        <AvatarFallback>
          <UserCircle className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{displayName}</p>
        <p className="text-xs text-white/70 truncate">{user.role}</p>
        <p className="text-xs text-white/70 truncate">{user.email}</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-1 p-0 h-6 text-xs text-white/70 hover:text-white"
          onClick={onEditClick}
        >
          <PenSquare className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
}
