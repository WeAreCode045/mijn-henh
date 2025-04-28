
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
import { User, UserBase } from "@/types/user";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isAgent, userRole, profile: authProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  if (!user) return null;

  const isParticipant = userRole === 'seller' || userRole === 'buyer';

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
  const userProfile: User | null = authProfile ? {
    id: authProfile.id || user?.id || '',
    email: authProfile.email || user?.email || '',
    full_name: authProfile.full_name || '',
    avatar_url: authProfile.avatar_url || undefined,
    phone: authProfile.phone || undefined,
    whatsapp_number: authProfile.whatsapp_number || undefined,
    // Ensure role is one of the allowed types
    role: (authProfile.role || userRole) as UserBase['role'],
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
