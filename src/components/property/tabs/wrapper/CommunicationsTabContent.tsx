
import { SubmissionsList } from "../communications/SubmissionsList";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { useSubmissions } from "../communications/useSubmissions";

interface CommunicationsTabContentProps {
  id: string;
  title: string;
}

export function CommunicationsTabContent({ id, title }: CommunicationsTabContentProps) {
  const {
    submissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    handleMarkAsRead,
    handleSendResponse
  } = useSubmissions(id);

  const handleSendResponseWrapper = async (responseText: string) => {
    await handleSendResponse(responseText);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <SubmissionsList 
          submissions={submissions} 
          isLoading={isLoading} 
          selectedSubmission={selectedSubmission} 
          onSelectSubmission={setSelectedSubmission}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>

      <div className="md:col-span-2">
        <SubmissionDetail 
          submission={selectedSubmission} 
          onMarkAsRead={handleMarkAsRead}
          onSendResponse={handleSendResponseWrapper}
        />
      </div>
    </div>
  );
}
