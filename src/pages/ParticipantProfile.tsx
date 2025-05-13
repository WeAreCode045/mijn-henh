
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useParticipantProfile } from "@/hooks/useParticipantProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipantProfileData } from "@/types/participant";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function ParticipantProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ParticipantProfileData>>({});
  
  useEffect(() => {
    async function fetchAccountId() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Find the participant account for this user
        const { data, error } = await supabase
          .from('accounts')
          .select('id')
          .eq('user_id', user.id)
          .eq('type', 'participant')
          .single();
          
        if (error) {
          console.error('Error fetching participant account:', error);
          setIsLoading(false);
          return;
        }
        
        if (!data) {
          console.log('No participant account found');
          setIsLoading(false);
          return;
        }
        
        setAccountId(data.id);
      } catch (err) {
        console.error('Error in fetchAccountId:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAccountId();
  }, [user]);
  
  const { profile, updateProfile } = useParticipantProfile(accountId || undefined);
  
  useEffect(() => {
    if (profile) {
      // Extract identification fields
      const identification = profile.identification || {};
      
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        whatsapp_number: profile.whatsapp_number || '',
        address: profile.address || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '',
        date_of_birth: profile.date_of_birth || '',
        place_of_birth: profile.place_of_birth || '',
        nationality: profile.nationality || '',
        gender: profile.gender || '',
        iban: profile.iban || '',
        // Handle identification properties safely
        identification: {
          type: identification?.type || null,
          document_number: identification?.document_number || null,
          social_number: identification?.social_number || null
        },
      });
    }
  }, [profile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId) {
      toast({
        title: "Error",
        description: "No participant account found.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      updateProfile(formData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested identification fields
    if (name.startsWith('identification.')) {
      const identificationField = name.split('.')[1];
      
      setFormData((prev) => ({
        ...prev,
        identification: {
          ...prev.identification,
          [identificationField]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!accountId) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Participant Profile</h1>
        <Card>
          <CardContent className="pt-6">
            <p>You are not registered as a participant. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name" 
                  name="first_name" 
                  value={formData.first_name || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input 
                  id="last_name" 
                  name="last_name" 
                  value={formData.last_name || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  value={formData.email || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input 
                id="whatsapp_number" 
                name="whatsapp_number" 
                value={formData.whatsapp_number || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input 
                id="date_of_birth" 
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="place_of_birth">Place of Birth</Label>
              <Input 
                id="place_of_birth" 
                name="place_of_birth"
                value={formData.place_of_birth || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input 
                id="nationality" 
                name="nationality"
                value={formData.nationality || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Input 
                id="gender" 
                name="gender"
                value={formData.gender || ''} 
                onChange={handleChange} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="identification.type">ID Type</Label>
              <Input 
                id="identification.type" 
                name="identification.type"
                value={formData.identification?.type || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="identification.document_number">ID Number</Label>
              <Input 
                id="identification.document_number" 
                name="identification.document_number"
                value={formData.identification?.document_number || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="identification.social_number">Social Security Number</Label>
              <Input 
                id="identification.social_number" 
                name="identification.social_number"
                value={formData.identification?.social_number || ''} 
                onChange={handleChange} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="iban">IBAN</Label>
              <Input 
                id="iban" 
                name="iban"
                value={formData.iban || ''} 
                onChange={handleChange} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input 
                id="address" 
                name="address"
                value={formData.address || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city"
                  value={formData.city || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input 
                  id="postal_code" 
                  name="postal_code"
                  value={formData.postal_code || ''} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  name="country"
                  value={formData.country || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
