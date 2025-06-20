
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";

export function useUserProfileData(user: User) {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
  });

  const displayName = `${formData.first_name || user.first_name || ''} ${formData.last_name || user.last_name || ''}`.trim() || 
                      (user.email ? user.email.split('@')[0] : 'Unknown');

  const fetchCompleteProfile = async () => {
    if (!user.user_id) return;
    
    setIsLoadingProfile(true);
    try {
      // Fetch from employer_profiles using user_id (which is now properly linked via foreign key)
      const { data: profile, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', user.user_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching complete profile:', error);
        toast({
          title: "Warning",
          description: "Could not load complete profile data",
          variant: "destructive",
        });
        return;
      }

      if (profile) {
        setFormData({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email: profile.email || user.email || "",
          phone: profile.phone || "",
          whatsapp_number: profile.whatsapp_number || "",
        });
      } else {
        // If no profile exists, initialize with user data
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          whatsapp_number: user.whatsapp_number || "",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    // Always initialize with user data first
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      whatsapp_number: user.whatsapp_number || "",
    });

    // Then fetch complete profile if user_id exists
    if (user.user_id) {
      fetchCompleteProfile();
    }
  }, [user.user_id, user.first_name, user.last_name, user.email, user.phone, user.whatsapp_number]);

  return {
    formData,
    setFormData,
    displayName,
    isLoadingProfile,
    fetchCompleteProfile
  };
}
