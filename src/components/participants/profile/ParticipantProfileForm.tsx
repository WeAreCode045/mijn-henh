
import { ParticipantProfileData } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParticipantProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  gender: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  iban: string;
  identification: {
    type: string | null;
    social_number: string | null;
    document_number: string | null;
  };
}

interface ParticipantProfileFormProps {
  participant: ParticipantProfileData;
  formData: ParticipantProfileFormData;
  onFormDataChange: (data: ParticipantProfileFormData) => void;
  onSubmit: (e: React.FormEvent, formData: ParticipantProfileFormData) => Promise<void>;
  onCancel: () => void;
  isUpdating: boolean;
  inSidebar?: boolean;
}

export function ParticipantProfileForm({
  participant,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isUpdating,
  inSidebar = false
}: ParticipantProfileFormProps) {
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e, formData);
  };

  const updateFormData = (field: string, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const updateIdentification = (field: string, value: any) => {
    onFormDataChange({ 
      ...formData, 
      identification: { ...formData.identification, [field]: value }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => updateFormData('first_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => updateFormData('last_name', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => updateFormData('whatsapp_number', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={participant.role || ''}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">Role cannot be changed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => updateFormData('date_of_birth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={formData.place_of_birth}
                onChange={(e) => updateFormData('place_of_birth', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => updateFormData('nationality', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) => updateFormData('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postal_code}
                onChange={(e) => updateFormData('postal_code', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identificationType">Document Type</Label>
            <Select
              value={formData.identification?.type || ""}
              onValueChange={(value) => updateIdentification('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="IDcard">ID Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="socialNumber">Social Security Number</Label>
              <Input
                id="socialNumber"
                value={formData.identification?.social_number || ""}
                onChange={(e) => updateIdentification('social_number', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number</Label>
              <Input
                id="documentNumber"
                value={formData.identification?.document_number || ""}
                onChange={(e) => updateIdentification('document_number', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={formData.iban}
              onChange={(e) => updateFormData('iban', e.target.value)}
              placeholder="Enter IBAN number"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isUpdating} className="flex-1">
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
