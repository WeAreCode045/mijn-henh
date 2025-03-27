
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { UserProfileDialog } from "./UserProfileDialog";

interface UserProfileCardProps {
  inSidebar?: boolean;
}

export function UserProfileCard({ inSidebar = false }: UserProfileCardProps) {
  const { user, profile } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user) return null;

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user.email?.substring(0, 2).toUpperCase() || "U";

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";

  if (inSidebar) {
    return (
      <div className="flex items-center justify-between p-2 bg-primary-color/80 rounded-md">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-white/70 truncate">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full text-white/80 hover:text-white hover:bg-primary-color" 
          onClick={() => setDialogOpen(true)}
        >
          <Edit className="h-3 w-3" />
        </Button>
        
        <UserProfileDialog 
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={() => setDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <UserProfileDialog 
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </CardContent>
    </Card>
  );
}
