
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { PropertyData } from '@/types/property';
import { useNavigate } from 'react-router-dom';
import { PropertyCard } from '@/components/property/PropertyCard';
import { DocumentList } from '@/components/property/documents/DocumentList';
import { MessageList } from '@/components/property/messages/MessageList';
import { transformSupabaseData } from '@/components/property/webview/utils/transformSupabaseData';
import { Button } from '@/components/ui/button';
import { UserCircle, Loader2 } from 'lucide-react';

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantProperties = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      
      try {
        // Get properties where the user is a participant (via accounts table)
        const { data: participations, error: participationsError } = await supabase
          .from('accounts')
          .select('property_id, role')
          .eq('user_id', user.id)
          .in('role', ['buyer', 'seller']);

        if (participationsError) {
          console.error('Error fetching property participations:', participationsError);
          return;
        }

        if (!participations.length) {
          setIsLoading(false);
          return;
        }

        const propertyIds = participations.map(p => p.property_id).filter(id => id !== null) as string[];
        
        if (propertyIds.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Fetch the property details
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(*),
            agent:accounts!properties_agent_id_fkey(
              id,
              user_id,
              email,
              role,
              user:employer_profiles!inner(
                id,
                first_name,
                last_name,
                phone,
                email,
                avatar_url
              )
            )
          `)
          .in('id', propertyIds);

        if (propertyError) {
          console.error('Error fetching properties:', propertyError);
          return;
        }

        // Process agent data to match the expected format
        const processedProperties = propertyData.map(property => {
          // Transform the agent data to match what transformSupabaseData expects
          const transformedProperty = {
            ...property,
            agent: property.agent ? {
              id: property.agent.user_id,
              full_name: property.agent.user
                ? `${property.agent.user.first_name || ''} ${property.agent.user.last_name || ''}`.trim()
                : (property.agent.email?.split('@')[0] || 'Unknown'),
              email: property.agent.email || '',
              phone: property.agent.user?.phone || '',
              avatar_url: property.agent.user?.avatar_url || ''
            } : null
          };

          return transformSupabaseData(transformedProperty);
        });
        
        setProperties(processedProperties);
        
        if (processedProperties.length > 0 && !selectedPropertyId) {
          setSelectedPropertyId(processedProperties[0].id);
        }
      } catch (error) {
        console.error('Error in participant dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipantProperties();
  }, [user?.id, selectedPropertyId]);

  const handleGoToProfile = () => {
    navigate('/participant/profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <Button onClick={handleGoToProfile} variant="outline">
            <UserCircle className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </div>
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
            <p className="text-lg text-gray-600">
              You are not yet connected to any properties. Please contact your agent for access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Property Dashboard</h1>
        <Button onClick={handleGoToProfile} variant="outline">
          <UserCircle className="mr-2 h-4 w-4" />
          View Profile
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Properties</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {properties.map(property => (
                <div 
                  key={property.id} 
                  className={`p-4 rounded-lg cursor-pointer ${
                    selectedPropertyId === property.id ? 'bg-primary/10' : 'bg-gray-100'
                  }`}
                  onClick={() => setSelectedPropertyId(property.id)}
                >
                  <h3 className="font-medium">{property.title}</h3>
                  <p className="text-sm text-gray-600">{property.address}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedPropertyId && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {properties.find(p => p.id === selectedPropertyId)?.title || 'Property Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="properties">Property Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="properties">
                    <div className="grid gap-4">
                      {selectedPropertyId && (
                        <PropertyCard 
                          property={properties.find(p => p.id === selectedPropertyId)!} 
                          onDelete={() => {}} // No delete functionality for participants
                        />
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents">
                    <DocumentList propertyId={selectedPropertyId} />
                  </TabsContent>
                  
                  <TabsContent value="messages">
                    <MessageList propertyId={selectedPropertyId} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
