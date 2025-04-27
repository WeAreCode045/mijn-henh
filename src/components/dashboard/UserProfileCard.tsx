
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Edit } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface UserProfileCardProps {
  inSidebar?: boolean;
}

export function UserProfileCard({ inSidebar = false }: UserProfileCardProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const handleEditProfile = () => {
    navigate("/settings"); // Navigate to settings page for now
  };
  
  // Extract initials from full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  if (inSidebar) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
            ) : (
              <AvatarFallback className="text-sm">
                {profile?.full_name ? getInitials(profile.full_name) : <User className="h-4 w-4" />}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium">{profile?.full_name || "User"}</h3>
            <p className="text-xs text-muted-foreground">{profile?.role || "User"}</p>
          </div>
        </div>
        <div className="text-xs space-y-1 ml-1">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground truncate max-w-[160px]">{profile?.email || "No email"}</span>
          </div>
          {profile?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{profile.phone}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-2">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
            ) : (
              <AvatarFallback className="text-lg">
                {profile?.full_name ? getInitials(profile.full_name) : <User />}
              </AvatarFallback>
            )}
          </Avatar>
          <h3 className="font-medium text-lg">{profile?.full_name || "User"}</h3>
          <span className="text-sm text-muted-foreground">{profile?.role || "User"}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-">{profile?.email || "No email"}</span>
          </div>
          {profile?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full color-black bg-gray-100 flex items-center gap-2"
          onClick={handleEditProfile}
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
