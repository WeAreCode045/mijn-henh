
import { 
  LayoutDashboard, 
  Home, 
  Settings, 
  LogOut,
  Users as UsersIcon,
  FileUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
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
  };

  if (!user) return null;

  return (
    <Sidebar className="bg-primary-color text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/')} className="hover:bg-primary-color/80 text-white">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/properties')} className="hover:bg-primary-color/80 text-white">
                <Home className="w-4 h-4" />
                <span>Properties</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/import')} className="hover:bg-primary-color/80 text-white">
                <FileUp className="w-4 h-4" />
                <span>Import</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/users')} className="hover:bg-primary-color/80 text-white">
                  <UsersIcon className="w-4 h-4" />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/settings')} className="hover:bg-primary-color/80 text-white">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-4 px-4">
        <SidebarGroup>
          <UserProfileCard inSidebar={true} />
          <SidebarMenu className="mt-4">
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="hover:bg-primary-color/80 text-white">
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
