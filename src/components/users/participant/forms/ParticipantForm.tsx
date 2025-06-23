import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipantFormData, ParticipantProfileData } from "@/types/participant";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";

interface ParticipantFormProps {
  isEditMode: boolean;
  initialData?: ParticipantProfileData;
  onSuccess: (formData: ParticipantProfileData) => void;
  onCancel?: () => void;
  isProfile?: boolean;
}

export function ParticipantForm({ 
  isEditMode, 
  initialData, 
  onSuccess, 
  onCancel,
  isProfile = false 
}: ParticipantFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ParticipantFormData>({
    email: "",
    first_name: "",
    last_name: "",
    role: "buyer",
    phone: "",
    whatsapp_number: "",
    date_of_birth: "",
    place_of_birth: "",
    nationality: "",
    gender: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    iban: "",
    identification: {
      type: null,
      social_number: "",
      document_number: ""
    },
    password: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      try {
        // Safely parse identification data
        let identification = {
          type: null as "passport" | "IDcard" | null,
          social_number: "",
          document_number: ""
        };
        
        if (initialData.identification) {
          const parsed = typeof initialData.identification === 'string' 
            ? JSON.parse(initialData.identification)
            : initialData.identification;
            
          identification = {
            type: parsed.type || null,
            social_number: parsed.social_number || "",
            document_number: parsed.document_number || ""
          };
        }
        
        // Update form data with initial values
        setFormData(prev => ({
          ...prev,
          ...initialData,
          identification,
          password: "" // Never pre-fill password
        }));
      } catch (error) {
        console.error('Error initializing form data:', error);
      }
    } else if (!isEditMode) {
      // Reset form for new participants
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        role: "buyer",
        phone: "",
        whatsapp_number: "",
        date_of_birth: "",
        place_of_birth: "",
        nationality: "",
        gender: "",
        address: "",
        city: "",
        postal_code: "",
        country: "",
        iban: "",
        identification: {
          type: null,
          social_number: "",
          document_number: ""
        },
        password: ""
      });
    }
  }, [initialData, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        await updateParticipant();
        toast({
          title: "Success",
          description: "Participant updated successfully",
          variant: "default",
        });
      } else {
        await createParticipant();
        toast({
          title: "Success",
          description: "Participant created successfully",
          variant: "default",
        });
      }
      
      // Pass the form data to onSuccess
      onSuccess(formData as ParticipantProfileData);
    } catch (error) {
      console.error("Error saving participant:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save participant",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateParticipant = async () => {
    if (!initialData?.id) throw new Error("No participant ID provided");
    
    const updates = {
      ...formData,
      identification: JSON.stringify(formData.identification),
      updated_at: new Date().toISOString(),
    };
    
    const { error } = await supabase
      .from("participants_profile")
      .update(updates)
      .eq("id", initialData.id);
      
    if (error) throw error;
  };

  const createParticipant = async () => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password || crypto.randomUUID(),
      options: {
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: 'participant',
          identification: JSON.stringify(formData.identification)
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user account");

    const participantData = {
      id: authData.user.id,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      whatsapp_number: formData.whatsapp_number,
      date_of_birth: formData.date_of_birth,
      place_of_birth: formData.place_of_birth,
      nationality: formData.nationality,
      gender: formData.gender,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postal_code,
      country: formData.country,
      iban: formData.iban,
      identification: JSON.stringify(formData.identification)
    };

    const { error: profileError } = await supabase
      .from("participants_profile")
      .insert(participantData);
      
    if (profileError) throw profileError;
  };

  const handleInputChange = (field: keyof ParticipantFormData, value: string | null | { type: string | null; social_number: string; document_number: string }) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIdentificationChange = (field: keyof ParticipantFormData['identification'], value: string | null) => {
    setFormData(prev => ({
      ...prev,
      identification: {
        ...prev.identification,
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={isEditMode}
              />
            </div>
            
            {!isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required={!isEditMode}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Identification */}
        <Card>
          <CardHeader>
            <CardTitle>Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identificationType">Document Type</Label>
              <Select
                value={formData.identification?.type || ""}
                onValueChange={(value: "passport" | "IDcard") => 
                  handleIdentificationChange('type', value)
                }
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
                  onChange={(e) => handleIdentificationChange('social_number', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  value={formData.identification?.document_number || ""}
                  onChange={(e) => handleIdentificationChange('document_number', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="place_of_birth">Place of Birth</Label>
              <Input
                id="place_of_birth"
                value={formData.place_of_birth}
                onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
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
            
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={formData.iban}
                onChange={(e) => handleInputChange('iban', e.target.value)}
                placeholder="NL00BANK0123456789"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditMode ? 'Update Participant' : 'Create Participant'
          )}
        </Button>
      </div>
    </form>
  );
}
