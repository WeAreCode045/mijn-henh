
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, Home, MessageCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyTabsProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  propertyId: string;
  children: ReactNode;
}

export function PropertyTabs({ 
  activeTab, 
  handleTabChange, 
  propertyId,
  children
}: PropertyTabsProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread submissions count
    const fetchUnreadCount = async () => {
      if (!propertyId) return;

      const { count, error } = await supabase
        .from('property_contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread count:', error);
      } else if (count !== null) {
        setUnreadCount(count);
      }
    };

    fetchUnreadCount();

    // Set up real-time subscription for unread count
    const submissionsSubscription = supabase
      .channel('unread-submissions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'property_contact_submissions',
        filter: `property_id=eq.${propertyId}`
      }, () => {
        // Refetch count when submissions change
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      submissionsSubscription.unsubscribe();
    };
  }, [propertyId]);

  const handleTabButtonClick = (tabValue: string) => {
    console.log(`Tab clicked: ${tabValue}, current activeTab: ${activeTab}`);
    handleTabChange(tabValue);
  };

  return (
    <>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger 
          value="dashboard" 
          onClick={() => handleTabButtonClick('dashboard')}
          data-state={activeTab === 'dashboard' ? 'active' : ''}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </TabsTrigger>
        <TabsTrigger 
          value="content" 
          onClick={() => handleTabButtonClick('content')}
          data-state={activeTab === 'content' ? 'active' : ''}
        >
          <FileText className="h-4 w-4" />
          <span>Content</span>
        </TabsTrigger>
        <TabsTrigger 
          value="media" 
          onClick={() => handleTabButtonClick('media')}
          data-state={activeTab === 'media' ? 'active' : ''}
        >
          <Image className="h-4 w-4" />
          <span>Media</span>
        </TabsTrigger>
        <TabsTrigger 
          value="communications" 
          onClick={() => handleTabButtonClick('communications')}
          data-state={activeTab === 'communications' ? 'active' : ''}
          className="relative"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Communications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      {children}
    </>
  );
}
