
import { useState, useEffect } from "react";
import { PropertySubmissionsDialog } from "@/components/property/PropertySubmissionsDialog";
import { useSubmissions, Submission } from "../communications/useSubmissions";
import { useMarkAsRead, useSendResponse } from "../communications/hooks/useSubmissionActions";
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";

interface CommunicationsTabContentProps {
  property: {
    id: string;
    title: string;
  };
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  const { submissions, loading, error, fetchSubmissions } = useSubmissions({ propertyId: property.id });
  const { markAsRead, isLoading: isMarkingAsRead } = useMarkAsRead({ 
    propertyId: property.id,
    onSuccess: fetchSubmissions
  });
  const { sendResponse, isSending } = useSendResponse({
    propertyId: property.id,
    onSuccess: fetchSubmissions
  });

  const handleSelectSubmission = (submission: Submission) => {
    if (!submission.is_read) {
      markAsRead(submission.id);
    }
    setSelectedSubmission(submission);
  };

  const handleSendResponse = async (id: string, message: string) => {
    await sendResponse(id, message);
  };

  // When submissions change, check if the selected one needs to be updated
  useEffect(() => {
    if (selectedSubmission) {
      const updatedSubmission = submissions.find(s => s.id === selectedSubmission.id);
      if (updatedSubmission) {
        setSelectedSubmission(updatedSubmission);
      }
    }
  }, [submissions, selectedSubmission]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <SubmissionsList
          submissions={submissions}
          selectedSubmissionId={selectedSubmission?.id}
          onSelectSubmission={handleSelectSubmission}
        />
      </div>
      
      <div className="md:col-span-2">
        {selectedSubmission ? (
          <SubmissionDetail
            submission={selectedSubmission}
            propertyTitle={property.title}
            onMarkAsRead={markAsRead}
            onSendResponse={handleSendResponse}
          />
        ) : (
          <div className="flex justify-center items-center h-40 border rounded-md bg-gray-50">
            <p className="text-gray-500">Selecteer een bericht om de details te bekijken</p>
          </div>
        )}
      </div>

      <PropertySubmissionsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        propertyTitle={property.title}
        submissions={submissions}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
}
