
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, FileTextIcon, MessageSquareIcon, GaugeIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface PropertyTabsProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  handleTabChange?: (tab: string) => void;
  children: React.ReactNode;
  propertyId?: string;
}

export function PropertyTabs({ activeTab, handleTabChange, onTabChange, children, propertyId }: PropertyTabsProps) {
  // Use onTabChange for backward compatibility
  const handleChange = handleTabChange || onTabChange;
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Fetch unread submissions count for this property
  useEffect(() => {
    if (!propertyId) return;
    
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('property_contact_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error fetching unread count:', error);
        return;
      }
      
      setUnreadCount(count || 0);
    };
    
    fetchUnreadCount();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('property-submissions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_contact_submissions',
          filter: `property_id=eq.${propertyId}`
        },
        () => {
          // Refresh the count when changes occur
          fetchUnreadCount();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId]);
  
  return (
    <Tabs
      value={activeTab}
      onValueChange={handleChange}
      className="w-full"
    >
      <TabsList className="mb-8">
        <TabsTrigger value="dashboard" className="flex gap-2">
          <GaugeIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
        
        <TabsTrigger value="content" className="flex gap-2">
          <FileTextIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Content</span>
        </TabsTrigger>
        
        <TabsTrigger value="media" className="flex gap-2">
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Media</span>
        </TabsTrigger>
        
        <TabsTrigger value="communications" className="flex gap-2 relative">
          <MessageSquareIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Communications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      {/* Render all tab content at once but only display the active one */}
      <TabsContent value={activeTab} forceMount>
        {children}
      </TabsContent>
    </Tabs>
  );
}
