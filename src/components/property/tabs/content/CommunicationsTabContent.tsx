
import React, { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, MailIcon, PhoneIcon, UserIcon, CalendarIcon, CheckIcon, XIcon, ArrowLeftIcon, Trash2Icon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateUtils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSubmissions } from "../communications/hooks";
import { EmailReplyModal } from "../communications/EmailReplyModal";
import { SubmissionReplies } from "../communications/SubmissionReplies";
import { useSubmissionReplies } from "../communications/hooks/useSubmissionReplies";
import { Submission } from "@/types/submission";
import { Separator } from "@/components/ui/separator";
import { useDeleteSubmissionItem } from "../communications/hooks/useDeleteSubmissionItem";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
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

  const filteredContacts = filterContactsByTab(contacts);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {contacts.filter(c => !c.is_read).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {contacts.filter(c => !c.is_read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">Loading contact submissions...</p>
          </CardContent>
        </Card>
      ) : filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <MessageCircleIcon className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No contact submissions yet</h3>
              <p className="text-muted-foreground">
                When potential clients submit inquiries about this property, they'll appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submissions List - Left Side */}
          <div className="md:col-span-1 space-y-4">
            {filteredContacts.map(contact => (
              <Card 
                key={contact.id} 
                className={`${contact.is_read ? "" : "border-l-4 border-l-blue-500"} 
                           ${selectedContact?.id === contact.id ? "ring-2 ring-primary" : ""}`}
              >
                <CardContent className="p-4 cursor-pointer" onClick={() => handleSelectSubmission(contact.id)}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                      <h3 className="text-lg font-medium">{contact.name}</h3>
                      <Badge className="ml-3" variant={
                        contact.inquiry_type === 'viewing' ? "default" : 
                        contact.inquiry_type === 'question' ? "secondary" : "outline"
                      }>
                        {contact.inquiry_type.charAt(0).toUpperCase() + contact.inquiry_type.slice(1)}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700 h-8 w-8"
                      onClick={(e) => handleDeleteSubmission(e, contact.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(contact.created_at)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        markAsRead(contact.id, !contact.is_read);
                      }}
                      className="h-6 text-xs"
                    >
                      {contact.is_read ? (
                        <XIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <CheckIcon className="h-3 w-3 mr-1" />
                      )}
                      {contact.is_read ? 'Unread' : 'Read'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Submission Detail - Right Side */}
          <div className="md:col-span-2">
            {selectedContact ? (
              <SubmissionDetailView 
                submission={selectedContact} 
                onMarkAsRead={(isRead) => markAsRead(selectedContact.id, isRead)}
                onReplyEmail={() => handleOpenEmailModal(selectedContact)}
                onBack={() => setSelectedContact(null)}
                onRefresh={fetchContactSubmissions}
                onDeleteReply={(replyId) => {
                  setItemToDelete({ id: replyId, type: 'reply' });
                  setDeleteDialogOpen(true);
                }}
              />
            ) : (
              <Card>
                <CardContent className="p-6 flex items-center justify-center h-[300px]">
                  <div className="text-center text-muted-foreground">
                    <MessageCircleIcon className="mx-auto h-10 w-10 mb-4" />
                    <p>Select a submission to view details</p>
                  </div>
                </CardContent>
              </Card>
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'submission' 
                ? 'This will permanently delete this submission and all its replies.' 
                : 'This will permanently delete this reply.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface SubmissionDetailViewProps {
  submission: ContactSubmission;
  onMarkAsRead: (isRead: boolean) => void;
  onReplyEmail: () => void;
  onBack: () => void;
  onRefresh: () => void;
  onDeleteReply: (replyId: string) => void;
}

function SubmissionDetailView({ 
  submission, 
  onMarkAsRead, 
  onReplyEmail, 
  onBack, 
  onRefresh,
  onDeleteReply 
}: SubmissionDetailViewProps) {
  const { replies, isLoading, error } = useSubmissionReplies(submission.id);
  const [expandedReplyIds, setExpandedReplyIds] = useState<Set<string>>(new Set());

  const toggleReplyExpansion = (replyId: string) => {
    setExpandedReplyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <CardTitle>{submission.name}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onMarkAsRead(!submission.is_read)}
            >
              {submission.is_read ? (
                <>
                  <XIcon className="h-4 w-4 mr-1" />
                  Mark as Unread
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Mark as Read
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
              {submission.email}
            </a>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
              {submission.phone}
            </a>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(submission.created_at)}
            </span>
          </div>
        </div>
        
        {/* Original Message */}
        <div className="mt-4 bg-muted p-4 rounded-md">
          <h4 className="font-semibold mb-2">Message:</h4>
          <p className="whitespace-pre-line">{submission.message}</p>
        </div>
        
        {/* Replies Section */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Replies</h4>
          {isLoading ? (
            <div className="text-center py-4">Loading replies...</div>
          ) : error ? (
            <div className="text-red-500 py-2">Error loading replies: {error}</div>
          ) : replies && replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map(reply => (
                <Collapsible 
                  key={reply.id} 
                  open={expandedReplyIds.has(reply.id)}
                  onOpenChange={() => toggleReplyExpansion(reply.id)}
                  className="border rounded-md bg-muted/50"
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">
                        {reply.agent?.full_name || reply.user?.name || "Agent"}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 h-8 w-8 hover:bg-red-100 hover:text-red-700"
                        onClick={() => onDeleteReply(reply.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 p-0 w-8">
                          {expandedReplyIds.has(reply.id) ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent className="px-3 pb-3">
                    <div className="whitespace-pre-line">{reply.message || reply.text}</div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-2 italic">No replies yet</div>
          )}
        </div>
        
        <Separator className="my-6" />
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button onClick={onReplyEmail}>
            <MailIcon className="h-4 w-4 mr-2" />
            Reply by Email
          </Button>
          {submission.phone && (
            <Button variant="outline" asChild>
              <a href={`tel:${submission.phone}`}>
                <PhoneIcon className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
