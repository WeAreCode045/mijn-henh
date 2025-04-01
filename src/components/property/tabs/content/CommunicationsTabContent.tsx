
import React, { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useDeleteSubmissionItem } from "../communications/hooks/useDeleteSubmissionItem";
import { TabFilter } from "../communications/components/TabFilter";
import { SubmissionsList } from "../communications/components/SubmissionsList";
import { SubmissionDetail } from "../communications/components/SubmissionDetail";
import { LoadingState } from "../communications/components/LoadingState";
import { EmptyState } from "../communications/components/EmptyState";
import { DeleteConfirmationDialog } from "../communications/components/DeleteConfirmationDialog";
import { EmailReplyModal } from "../communications/EmailReplyModal";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  created_at: string;
  is_read: boolean;
};

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'submission' | 'reply' } | null>(null);

  // Use the property ID to fetch submissions for this specific property only
  useEffect(() => {
    fetchContactSubmissions();
  }, [property.id]);

  const fetchContactSubmissions = async () => {
    // Validate that we have a valid property ID before making the query
    if (!property.id || property.id.trim() === '') {
      setLoading(false);
      setContacts([]);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching submissions for property ID:", property.id);
      const { data, error } = await supabase
        .from('property_contact_submissions')
        .select('*')
        .eq('property_id', property.id) // Filter by the property ID
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching contact submissions:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} submissions for property ID: ${property.id}`);
      setContacts(data as ContactSubmission[]);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('property_contact_submissions')
        .update({ is_read: isRead })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === id ? { ...contact, is_read: isRead } : contact
        )
      );
    } catch (error) {
      console.error('Error updating contact submission:', error);
    }
  };

  const filterContactsByTab = (contacts: ContactSubmission[]) => {
    switch (activeTab) {
      case 'unread':
        return contacts.filter(contact => !contact.is_read);
      case 'read':
        return contacts.filter(contact => contact.is_read);
      default:
        return contacts;
    }
  };

  const handleOpenEmailModal = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    setEmailModalOpen(false);
    fetchContactSubmissions(); // Refresh the data after sending an email
  };

  const handleSelectSubmission = (id: string) => {
    setSelectedContact(contacts.find(contact => contact.id === id) || null);
  };

  const { deleteSubmission, deleteReply, isDeleting } = useDeleteSubmissionItem({
    onSuccess: fetchContactSubmissions
  });

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'submission') {
      await deleteSubmission(itemToDelete.id);
      if (selectedContact?.id === itemToDelete.id) {
        setSelectedContact(null);
      }
    } else {
      await deleteReply(itemToDelete.id);
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteSubmission = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent selecting the submission
    setItemToDelete({ id, type: 'submission' });
    setDeleteDialogOpen(true);
  };

  const handleDeleteReply = (replyId: string) => {
    setItemToDelete({ id: replyId, type: 'reply' });
    setDeleteDialogOpen(true);
  };

  const filteredContacts = filterContactsByTab(contacts);
  const unreadCount = contacts.filter(c => !c.is_read).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>
      
      <TabFilter 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        unreadCount={unreadCount}
      />

      {loading ? (
        <LoadingState />
      ) : filteredContacts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submissions List - Left Side */}
          <div className="md:col-span-1 space-y-4">
            <SubmissionsList 
              contacts={filteredContacts}
              selectedContactId={selectedContact?.id || null}
              onSelect={handleSelectSubmission}
              onMarkAsRead={markAsRead}
              onDelete={handleDeleteSubmission}
            />
          </div>
          
          {/* Submission Detail - Right Side */}
          <div className="md:col-span-2">
            {selectedContact ? (
              <SubmissionDetail 
                submission={selectedContact}
                onMarkAsRead={(isRead) => markAsRead(selectedContact.id, isRead)}
                onReplyEmail={() => handleOpenEmailModal(selectedContact)}
                onBack={() => setSelectedContact(null)}
                onRefresh={fetchContactSubmissions}
                onDeleteReply={handleDeleteReply}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] p-6 border rounded-md text-center text-muted-foreground">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 mb-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p>Select a submission to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Reply Modal */}
      {selectedContact && (
        <EmailReplyModal
          isOpen={emailModalOpen}
          onClose={handleCloseEmailModal}
          recipientEmail={selectedContact.email}
          recipientName={selectedContact.name}
          propertyId={property.id}
          propertyTitle={property.title || "Property"}
          submissionId={selectedContact.id}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        itemType={itemToDelete?.type || "submission"}
      />
    </div>
  );
}
