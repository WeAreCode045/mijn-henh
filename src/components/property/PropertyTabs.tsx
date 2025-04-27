import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, Home, MessageCircle, Users, FileCheck } from "lucide-react";
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
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

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

      // Check for unread messages
      const { count: messageCount, error: messageError } = await supabase
        .from('property_messages')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('is_read', false);
      
      if (!messageError && messageCount !== null && messageCount > 0) {
        setHasUnreadMessages(true);
      } else {
        setHasUnreadMessages(false);
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
      
    // Set up real-time subscription for unread messages
    const messagesSubscription = supabase
      .channel('unread-messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'property_messages',
        filter: `property_id=eq.${propertyId}`
      }, () => {
        // Refetch count when messages change
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      submissionsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, [propertyId]);

  return (
    <>
      <TabsList className="grid grid-cols-7 mb-8">
        <TabsTrigger 
          value="dashboard" 
          onClick={() => handleTabChange('dashboard')}
          className="flex items-center gap-2"
          data-state={activeTab === 'dashboard' ? 'active' : ''}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </TabsTrigger>
        <TabsTrigger 
          value="content" 
          onClick={() => handleTabChange('content')}
          className="flex items-center gap-2"
          data-state={activeTab === 'content' ? 'active' : ''}
        >
          <FileText className="h-4 w-4" />
          <span>Content</span>
        </TabsTrigger>
        <TabsTrigger 
          value="media" 
          onClick={() => handleTabChange('media')}
          className="flex items-center gap-2"
          data-state={activeTab === 'media' ? 'active' : ''}
        >
          <Image className="h-4 w-4" />
          <span>Media</span>
        </TabsTrigger>
        <TabsTrigger 
          value="communications" 
          onClick={() => handleTabChange('communications')}
          className="flex items-center gap-2 relative"
          data-state={activeTab === 'communications' ? 'active' : ''}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Communications</span>
          {(unreadCount > 0 || hasUnreadMessages) && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount + (hasUnreadMessages ? 1 : 0)}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="participants" 
          onClick={() => handleTabChange('participants')}
          className="flex items-center gap-2"
          data-state={activeTab === 'participants' ? 'active' : ''}
        >
          <Users className="h-4 w-4" />
          <span>Participants</span>
        </TabsTrigger>
        <TabsTrigger 
          value="documents" 
          onClick={() => handleTabChange('documents')}
          className="flex items-center gap-2"
          data-state={activeTab === 'documents' ? 'active' : ''}
        >
          <FileCheck className="h-4 w-4" />
          <span>Documents</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </>
  );
}
