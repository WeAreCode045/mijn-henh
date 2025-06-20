
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ParticipantProfileData } from "@/types/participant";
import { Edit, Phone, Mail, MapPin, CreditCard, FileText } from "lucide-react";

interface ParticipantProfileDisplayProps {
  participant: ParticipantProfileData;
  displayName: string;
  phone?: string;
  onEditClick: () => void;
}

export function ParticipantProfileDisplay({ 
  participant, 
  displayName, 
  phone, 
  onEditClick 
}: ParticipantProfileDisplayProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{displayName}</h3>
            <p className="text-sm text-muted-foreground capitalize">{participant.role}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Email</span>
            </div>
            <p className="text-sm">{participant.email || "Not provided"}</p>
          </div>
          
          {phone && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Phone</span>
              </div>
              <p className="text-sm">{phone}</p>
            </div>
          )}

          {participant.address && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Address</span>
              </div>
              <p className="text-sm">
                {participant.address}
                {participant.city && `, ${participant.city}`}
                {participant.postal_code && ` ${participant.postal_code}`}
                {participant.country && `, ${participant.country}`}
              </p>
            </div>
          )}

          {participant.iban && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">IBAN</span>
              </div>
              <p className="text-sm font-mono">{participant.iban}</p>
            </div>
          )}

          {participant.nationality && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Nationality</span>
              </div>
              <p className="text-sm">{participant.nationality}</p>
            </div>
          )}

          {participant.date_of_birth && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Date of Birth</span>
              </div>
              <p className="text-sm">{new Date(participant.date_of_birth).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
