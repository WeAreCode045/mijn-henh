
import React from "react";
import { useFetchSubmissions } from "@/components/property/tabs/communications/hooks/useFetchSubmissions";
import { 
  LoadingState, 
  EmptyState, 
  SubmissionsList, 
  SubmissionDetail 
} from "../tabs/communications/components";
import { useState } from "react";
import { Submission } from "../tabs/communications/types";
import { useMarkAsRead } from "../tabs/communications/hooks/useMarkAsRead";
import { useDeleteSubmissionItem } from "../tabs/communications/hooks/useDeleteSubmissionItem";
import { DeleteConfirmationDialog } from "../tabs/communications/components/DeleteConfirmationDialog";
import { EmailReplyModal } from "../tabs/communications/EmailReplyModal";

interface PropertyContactSubmissionsProps {
  propertyId: string;
}

export function PropertyContactSubmissions({ propertyId }: PropertyContactSubmissionsProps) {
  const { submissions, isLoading, refetch } = useFetchSubmissions(propertyId);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { markAsRead } = useMarkAsRead();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'submission' | 'reply' } | null>(null);

  const { deleteSubmission, deleteReply, isDeleting } = useDeleteSubmissionItem({
    onSuccess: refetch
  });

  const handleSelectSubmission = (id: string) => {
    // Find the submission in the submissions array to ensure we're using the correct type
    const submission = submissions.find(s => s.id === id);
    if (submission) {
      // Use the submission directly from the submissions array, which has the correct type
      setSelectedSubmission(submission);
      
      // Mark as read when selected if not already read
      if (!submission.is_read) {
        markAsRead(propertyId, id);
      }
    }
  };

  const handleOpenEmailModal = () => {
    if (selectedSubmission) {
      setEmailModalOpen(true);
    }
  };

  const handleCloseEmailModal = () => {
    setEmailModalOpen(false);
    refetch(); // Refresh after sending email
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

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'submission') {
      await deleteSubmission(itemToDelete.id);
      if (selectedSubmission?.id === itemToDelete.id) {
        setSelectedSubmission(null);
      }
    } else {
      await deleteReply(itemToDelete.id);
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  // Create an adapter function to convert between the required parameter formats
  const handleMarkAsRead = (id: string, isRead: boolean) => {
    markAsRead(propertyId, id);
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState />
      ) : submissions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submissions List - Left Side */}
          <div className="md:col-span-1">
            <SubmissionsList 
              contacts={submissions}
              selectedContactId={selectedSubmission?.id || null}
              onSelect={handleSelectSubmission}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteSubmission}
            />
          </div>
          
          {/* Submission Detail - Right Side */}
          <div className="md:col-span-2">
            {selectedSubmission ? (
              <SubmissionDetail 
                submission={selectedSubmission}
                onMarkAsRead={(isRead) => handleMarkAsRead(selectedSubmission.id, isRead)}
                onReplyEmail={handleOpenEmailModal}
                onBack={() => setSelectedSubmission(null)}
                onRefresh={refetch}
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
      {selectedSubmission && (
        <EmailReplyModal
          isOpen={emailModalOpen}
          onClose={handleCloseEmailModal}
          recipientEmail={selectedSubmission.email}
          recipientName={selectedSubmission.name}
          propertyId={propertyId}
          propertyTitle="Property" // Could be improved with actual property title
          submissionId={selectedSubmission.id}
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
