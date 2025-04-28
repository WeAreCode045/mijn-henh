
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';

interface ParticipantProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  date_of_birth: string | null;
  id_number: string;
  social_number: string;
  place_of_birth: string;
  nationality: string;
  gender: string;
  bank_account_number: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export default function ParticipantProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ParticipantProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    date_of_birth: null,
    id_number: '',
    social_number: '',
    place_of_birth: '',
    nationality: '',
    gender: '',
    bank_account_number: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        navigate('/auth?redirect=/participant/profile');
        return;
      }

      setIsLoading(true);
      
      try {
        // First check if user has a participant role in users_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('users_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['buyer', 'seller'])
          .single();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error checking user role:', roleError);
          toast({
            title: 'Error',
            description: 'Failed to verify your participant status',
            variant: 'destructive',
          });
        }

        // Only proceed if user is a buyer or seller
        if (!roleData) {
          console.log("User is not a buyer or seller");
          toast({
            title: 'Access Denied',
            description: 'You do not have participant access',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }

        // Check if there's a participant profile
        const { data: participantProfile, error } = await supabase
          .from('participants_profile')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // Not found is ok, we'll create it
            console.error('Error fetching participant profile:', error);
            toast({
              title: 'Error',
              description: 'Failed to load your profile',
              variant: 'destructive',
            });
          }
        }

        // If profile exists, use it
        if (participantProfile) {
          setProfileData({
            first_name: participantProfile.first_name || '',
            last_name: participantProfile.last_name || '',
            email: participantProfile.email || '',
            phone: participantProfile.phone || '',
            whatsapp_number: participantProfile.whatsapp_number || '',
            date_of_birth: participantProfile.date_of_birth ? 
              format(new Date(participantProfile.date_of_birth), 'yyyy-MM-dd') : null,
            id_number: participantProfile.id_number || '',
            social_number: participantProfile.social_number || '',
            place_of_birth: participantProfile.place_of_birth || '',
            nationality: participantProfile.nationality || '',
            gender: participantProfile.gender || '',
            bank_account_number: participantProfile.bank_account_number || '',
            address: participantProfile.address || '',
            city: participantProfile.city || '',
            postal_code: participantProfile.postal_code || '',
            country: participantProfile.country || '',
          });
        } else {
          // Get email from auth.users via profiles table
          const { data: authUserData } = await supabase.auth.getUser();
          
          if (authUserData?.user?.email) {
            setProfileData(prev => ({
              ...prev,
              email: authUserData.user.email || '',
            }));
          }
        }

      } catch (error) {
        console.error('Error in participant profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, navigate, toast]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    
    try {
      // Format date properly for database
      const formattedData = {
        ...profileData,
        date_of_birth: profileData.date_of_birth ? profileData.date_of_birth : null,
      };

      const { error } = await supabase
        .from('participants_profile')
        .upsert({
          id: user.id,
          ...formattedData,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your profile has been updated',
      });

    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update your profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button onClick={handleSaveProfile} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="contact">Contact Information</TabsTrigger>
              <TabsTrigger value="address">Address Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input 
                    id="first_name" 
                    name="first_name" 
                    value={profileData.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input 
                    id="last_name" 
                    name="last_name" 
                    value={profileData.last_name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input 
                    id="date_of_birth" 
                    name="date_of_birth" 
                    type="date"
                    value={profileData.date_of_birth || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input 
                    id="gender" 
                    name="gender" 
                    value={profileData.gender}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="place_of_birth">Place of Birth</Label>
                  <Input 
                    id="place_of_birth" 
                    name="place_of_birth" 
                    value={profileData.place_of_birth}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input 
                    id="nationality" 
                    name="nationality" 
                    value={profileData.nationality}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="id_number">ID/Passport Number</Label>
                  <Input 
                    id="id_number" 
                    name="id_number" 
                    value={profileData.id_number}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="social_number">Social Security Number</Label>
                  <Input 
                    id="social_number" 
                    name="social_number" 
                    value={profileData.social_number}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">Bank Account Number</Label>
                  <Input 
                    id="bank_account_number" 
                    name="bank_account_number" 
                    value={profileData.bank_account_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    readOnly
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profileData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                  <Input 
                    id="whatsapp_number" 
                    name="whatsapp_number" 
                    value={profileData.whatsapp_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={profileData.address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={profileData.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input 
                    id="postal_code" 
                    name="postal_code" 
                    value={profileData.postal_code}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    name="country" 
                    value={profileData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
