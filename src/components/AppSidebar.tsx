
import { 
  LayoutDashboard, 
  Home, 
  Settings, 
  LogOut,
  Users as UsersIcon,
  FileUp,
  ChevronDown,
  Globe
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { useState, useEffect } from "react";
import { User } from "@/types/user";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isAgent, userRole, profile: authProfile } = useAuth();
  const { toast } = useToast();
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Fetch the profile data
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('*, user_id, role, email')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        if (data) {
          // Get additional info for the profile
          const { data: employerData, error: employerError } = await supabase
            .from('employer_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (employerError && employerError.code !== 'PGRST116') {
            console.error("Error fetching employer profile:", employerError);
          }
          
          setProfile({
            ...data,
            ...employerData,
            full_name: employerData ? 
              `${employerData.first_name || ''} ${employerData.last_name || ''}`.trim() : 
              data.email?.split('@')[0] || 'User'
          });
        }
      } catch (err) {
        console.error("Error in fetchProfile:", err);
      }
    };
    
    fetchProfile();
  }, [user?.id]);
  
  // Safely access role with fallback
  const userRole2 = profile?.role || authProfile?.role || userRole || 'agent';

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        });
      } else {
        navigate('/auth');
      }
    } catch (err) {
      console.error("Error during logout:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Use a separate effect for navigation to prevent render loops
  useEffect(() => {
    // Only redirect if we have a user and they should be on participant dashboard
    if (user && (userRole2 === 'seller' || userRole2 === 'buyer') && location.pathname === '/') {
      navigate('/participant');
    }
  }, [user, userRole2, navigate, location.pathname]);

  if (!user) return null;

  const isParticipant = userRole2 === 'seller' || userRole2 === 'buyer';

  // Create properly typed user object for the profile card
  const userProfile: User | null = profile || authProfile ? {
    id: profile?.user_id || authProfile?.id || user?.id || '',
    email: profile?.email || authProfile?.email || user?.email || '',
    full_name: profile?.full_name || authProfile?.full_name || '',
    avatar_url: profile?.avatar_url || authProfile?.avatar_url || undefined,
    phone: profile?.phone || authProfile?.phone || undefined,
    whatsapp_number: profile?.whatsapp_number || authProfile?.whatsapp_number || undefined,
    role: profile?.role || authProfile?.role || userRole || undefined,
    created_at: profile?.created_at || authProfile?.created_at || undefined,
    updated_at: profile?.updated_at || authProfile?.updated_at || undefined
  } : null;

  return (
    <Sidebar>
      <SidebarContent className="!bg-primary text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => navigate(isParticipant ? '/participant' : '/')} 
                className="text-white hover:bg-primary-foreground/10"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {!isParticipant && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setPropertiesOpen(!propertiesOpen)} 
                    className="text-white hover:bg-primary-foreground/10"
                  >
                    <Home className="w-4 h-4" />
                    <span>Properties</span>
                    <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${propertiesOpen ? 'rotate-180' : ''}`} />
                  </SidebarMenuButton>
                  
                  {propertiesOpen && (
                    <div className="ml-6 pl-2 border-l border-primary-foreground/20 mt-1 space-y-1">
                      <SidebarMenuButton 
                        onClick={() => navigate('/properties')}
                        className={`text-white hover:bg-primary-foreground/10 ${location.pathname === '/properties' ? 'bg-primary-foreground/10' : ''}`}
                      >
                        All Properties
                      </SidebarMenuButton>
                      <SidebarMenuButton 
                        onClick={() => navigate('/properties/global-features')}
                        className={`text-white hover:bg-primary-foreground/10 ${location.pathname === '/properties/global-features' ? 'bg-primary-foreground/10' : ''}`}
                      >
                        Global Features
                      </SidebarMenuButton>
                      <SidebarMenuButton 
                        onClick={() => navigate('/properties/webviews')}
                        className={`text-white hover:bg-primary-foreground/10 ${location.pathname === '/properties/webviews' ? 'bg-primary-foreground/10' : ''}`}
                      >
                        Webviews
                      </SidebarMenuButton>
                    </div>
                  )}
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate('/import')} className="text-white hover:bg-primary-foreground/10">
                    <FileUp className="w-4 h-4" />
                    <span>Import</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {isAdmin && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => navigate('/users')} className="text-white hover:bg-primary-foreground/10">
                        <UsersIcon className="w-4 h-4" />
                        <span>Employees</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => navigate('/participants')} className="text-white hover:bg-primary-foreground/10">
                        <UsersIcon className="w-4 h-4" />
                        <span>Participants</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </>
            )}
            
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/settings')} className="text-white hover:bg-primary-foreground/10">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-4 px-4 !bg-primary text-white">
        <SidebarGroup>
          {userProfile && <UserProfileCard user={userProfile} inSidebar={true} />}
          <SidebarMenu className="mt-4">
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="text-white hover:bg-primary-foreground/10">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
