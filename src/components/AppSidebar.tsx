
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
    <Sidebar>
      <SidebarContent className="!bg-primary text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/')} className="text-white hover:bg-primary-foreground/10">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/properties')} className="text-white hover:bg-primary-foreground/10">
                <Home className="w-4 h-4" />
                <span>Properties</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/import')} className="text-white hover:bg-primary-foreground/10">
                <FileUp className="w-4 h-4" />
                <span>Import</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/users')} className="text-white hover:bg-primary-foreground/10">
                  <UsersIcon className="w-4 h-4" />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
          <UserProfileCard inSidebar={true} />
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
