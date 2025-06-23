import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchAccountAndProfile() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // First get the participant account associated with this user
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'participant')
          .single();
          
        if (accountError) {
          console.error('Error fetching participant account:', accountError);
          setIsLoading(false);
          return;
        }
        
        if (!accountData) {
          console.log('No participant account found for this user');
          setIsLoading(false);
          return;
        }
        
        setAccountId(accountData.id);
        
        // Get email from auth.users
        let userEmail = '';
        const { data: userData } = await supabase.auth.admin.getUserById(user.id);
        if (userData && userData.user) {
          userEmail = userData.user.email || '';
        }
        
        // Fetch participant profile
        const { data: profileData } = await supabase
          .from('participants_profile')
          .select('*')
          .eq('id', accountData.id)
          .single();
          
        // Use email from profile, auth user, or empty string
        const email = profileData?.email || userEmail || '';
        
        setUserProfile({
          id: accountData.id,
          email,
          full_name: accountData.display_name || 'Participant',
          role: accountData.role,
          status: accountData.status,
          ...profileData
        });
        
        // Find properties associated with this participant
        const { data: propertiesAsBuyer } = await supabase
          .from('properties')
          .select('*')
          .eq('buyer_id', accountData.id);
          
        const { data: propertiesAsSeller } = await supabase
          .from('properties')
          .select('*')
          .eq('seller_id', accountData.id);
          
        const allProperties = [
          ...(propertiesAsBuyer || []).map(p => ({ ...p, role: 'buyer' })),
          ...(propertiesAsSeller || []).map(p => ({ ...p, role: 'seller' }))
        ];
        
        setProperties(allProperties);
      } catch (err) {
        console.error('Error in fetchAccountAndProfile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAccountAndProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!accountId || !userProfile) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Participant Dashboard</h1>
        <Card>
          <CardContent className="pt-6">
            <p>You are not registered as a participant. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Participant Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {userProfile.full_name}</p>
              <p><span className="font-medium">Email:</span> {userProfile.email}</p>
              <p><span className="font-medium">Role:</span> {userProfile.role}</p>
              <p><span className="font-medium">Status:</span> {userProfile.status}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Your Properties</h2>
      {properties.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <p>You don't have any properties assigned to you yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => navigate(`/property/${property.id}`)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{property.title || 'Unnamed Property'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  {property.address || 'No address'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Your role:</span> {property.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
