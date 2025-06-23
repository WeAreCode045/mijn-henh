
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useParticipantProfile } from "@/hooks/useParticipantProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipantProfileData } from "@/types/participant";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ParticipantForm } from "@/components/participants/forms/ParticipantForm";
import { Button } from "@/components/ui/button";

export default function ParticipantProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { profile, updateProfile } = useParticipantProfile(accountId || undefined);

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

  const handleFormSuccess = async (formData: ParticipantProfileData) => {
    if (!accountId) {
      toast({
        title: "Error",
        description: "No participant account found.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);

      // Update the profile
      await updateProfile(formData);

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !profile ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <ParticipantForm
                isEditMode={true}
                initialData={profile}
                onSuccess={handleFormSuccess}
                isProfile={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
