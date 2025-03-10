import { useState } from "react";
import { PropertySubmissionsDialog } from "@/components/property/PropertySubmissionsDialog";
import { useSubmissions } from "../communications/useSubmissions";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useSubmissionActions } from "../communications/hooks/useSubmissionActions";

interface CommunicationsTabContentProps {
  property: {
    id: string;
    title: string;
  };
  handlers: any;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { submissions, loading, error, fetchSubmissions } = useSubmissions(property.id);
  const { markAsRead, sendResponse, isSending } = useSubmissionActions();
  
  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
    if (submission && !submission.is_read) {
      markAsRead(submission.id);
    }
  };

  const handleSendResponse = async (id, text) => {
    await sendResponse(id, text);
    fetchSubmissions();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Communications</h2>
      
      {/* Submissions List */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Submissions</h3>
        {loading ? (
          <p>Loading submissions...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <SubmissionsList 
            submissions={submissions}
            onSelectSubmission={handleSelectSubmission}
          />
        )}
      </div>

      {/* Submission Detail */}
      {selectedSubmission && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Submission Detail</h3>
          <SubmissionDetail
            submission={selectedSubmission}
            onMarkAsRead={markAsRead}
            onReply={handleSendResponse}
            isSending={isSending}
          />
        </div>
      )}

      {/* Property Submissions Dialog */}
      <PropertySubmissionsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        propertyTitle={property.title}
        submissions={submissions}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
}
