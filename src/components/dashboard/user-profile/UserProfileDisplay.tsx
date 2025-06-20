
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Phone, PenSquare } from "lucide-react";
import { User } from "@/types/user";

interface UserProfileDisplayProps {
  user: User;
  displayName: string;
  phone?: string;
  onEditClick: () => void;
}

export function UserProfileDisplay({ user, displayName, phone, onEditClick }: UserProfileDisplayProps) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>
              <UserCircle className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{displayName}</h3>
          <p className="text-sm text-gray-500 mb-1">{user.role}</p>
          <div className="flex items-center mt-4 space-x-1 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          {phone && (
            <div className="flex items-center mt-2 space-x-1 text-sm text-gray-500">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-4 pt-0">
        <Button variant="outline" size="sm" onClick={onEditClick} className="space-x-1">
          <PenSquare className="h-4 w-4" />
          <span>Edit Profile</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
