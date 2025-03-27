
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, Edit } from "lucide-react";
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
      <div className="space-y-3 p-3 bg-primary-foreground/10 rounded-lg">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-white">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
            ) : (
              <AvatarFallback className="text-sm bg-primary-foreground/20 text-white">
                {profile?.full_name ? getInitials(profile.full_name) : <User className="h-4 w-4" />}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-white">{profile?.full_name || "User"}</h3>
            <p className="text-xs text-white/70">{profile?.role || "User"}</p>
          </div>
        </div>
        <div className="text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-white/70" />
            <span className="text-white/80 truncate max-w-[160px]">{profile?.email || "No email"}</span>
          </div>
          {profile?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-white/70" />
              <span className="text-white/80">{profile.phone}</span>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full mt-2 text-white border-white/30 hover:bg-white/10 hover:text-white"
          onClick={handleEditProfile}
        >
          <Edit className="h-3 w-3 mr-2" />
          Edit Profile
        </Button>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-3">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
            ) : (
              <AvatarFallback className="text-xl">
                {profile?.full_name ? getInitials(profile.full_name) : <User />}
              </AvatarFallback>
            )}
          </Avatar>
          <h3 className="font-medium text-xl">{profile?.full_name || "User"}</h3>
          <span className="text-sm text-muted-foreground">{profile?.role || "User"}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile?.email || "No email"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile?.phone || "No phone"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={handleEditProfile}
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
