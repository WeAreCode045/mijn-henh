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
  SidebarMenuItem,
  SidebarMenuButton, 
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
  const { user, isAdmin, isAgent, userRole, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false); // State for users dropdown
  const [localIsAdmin, setLocalIsAdmin] = useState(false);

  useEffect(() => {
    // Check user role directly
    const checkUserRole = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('employer_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            return;
          }

          // Check if user role is available in accounts table
          const { data: accountData, error: accountError } = await supabase
            .from('accounts')
            .select('role')
            .eq('user_id', user.id)
            .single();
            
          if (accountError && accountError.code !== 'PGRST116') {
            console.error('Error fetching user account:', accountError);
            return;
          }

          if (accountData) {
            console.log('User role from accounts table:', accountData.role);
            setLocalIsAdmin(accountData.role === 'admin');
          }
        } catch (err) {
          console.error('Error in role check:', err);
        }
      }
    };
    checkUserRole();
  }, [user]);

  if (!user) return null;

  const isParticipant = userRole === 'seller' || userRole === 'buyer';
  const showAdminMenu = isAdmin || localIsAdmin;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (err) {
      console.error("Error during logout:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Create properly typed user object for the profile card
  const userProfile: User | null = profile ? {
    id: profile.id || user?.id || '',
    email: profile.email || user?.email || '',
    full_name: profile.full_name || '',
    avatar_url: profile.avatar_url || undefined,
    phone: profile.phone || undefined,
    whatsapp_number: profile.whatsapp_number || undefined,
    role: (profile.role || userRole) as User['role'],
  } : null;

  // For debugging
  console.log("Sidebar user profile:", userProfile);
  console.log("isAdmin:", isAdmin);
  console.log("localIsAdmin:", localIsAdmin);
  console.log("userRole:", userRole);
  console.log("showAdminMenu:", showAdminMenu);

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
                    <div className="ml-6 pl-2 border-l border-primary-foreground/20 mt-1 space-y-1 bg-primary-foreground/5 rounded-md py-1">
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
                
                <SidebarMenuItem className="relative">
                  <SidebarMenuButton 
                    onClick={() => setUsersOpen(!usersOpen)} 
                    className="text-white hover:bg-primary-foreground/10 w-full"
                  >
                    <UsersIcon className="w-4 h-4" />
                    <span>Users</span>
                    <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${usersOpen ? 'rotate-180' : ''}`} />
                  </SidebarMenuButton>
                  
                  {usersOpen && (
                    <div className="ml-6 pl-2 border-l border-primary-foreground/20 mt-1 space-y-1 bg-primary-foreground/10 rounded-md py-2">
                      <SidebarMenuButton 
                        onClick={() => navigate('/employees')}
                        className={`text-white hover:bg-primary-foreground/20 ${location.pathname === '/employees' || location.pathname === '/users' ? 'bg-primary-foreground/20' : ''}`}
                      >
                        Employees
                      </SidebarMenuButton>
                      <SidebarMenuButton 
                        onClick={() => navigate('/participants')}
                        className={`text-white hover:bg-primary-foreground/20 ${location.pathname === '/participants' ? 'bg-primary-foreground/20' : ''}`}
                      >
                        Participants
                      </SidebarMenuButton>
                    </div>
                  )}
                </SidebarMenuItem>
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
          {userProfile && (
            <div className="px-2 py-3 rounded bg-primary-foreground/5">
              <UserProfileCard user={userProfile} inSidebar={true} />
            </div>
          )}
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
