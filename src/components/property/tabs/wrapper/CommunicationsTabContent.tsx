
import { PropertyData } from "@/types/property";
import { SubmissionDetail } from "../communications/SubmissionDetail";
import { SubmissionsList } from "../communications/SubmissionsList";
import { useSubmissions } from "../communications/useSubmissions";
import { useSubmissionSelection } from "../communications/hooks/useSubmissionSelection";
import { useSubmissionActions } from "../communications/hooks/useSubmissionActions";
import { useMarkAsRead } from "../communications/hooks/useMarkAsRead";
import { useSendResponse } from "../communications/hooks/useSendResponse";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const { submissions, loading, error, fetchSubmissions } = useSubmissions(property.id);
  const { selectedSubmission, setSelectedSubmission } = useSubmissionSelection();
  
  // Use the hooks with correct arguments
  const { handleMarkAsRead } = useMarkAsRead({ propertyId: property.id });
  const { handleSendResponse, isSending } = useSendResponse({ propertyId: property.id });
  
  // Handle selection and mark as read
  const handleSelectSubmission = (submissionId: string) => {
    setSelectedSubmission(submissionId);
    
    // Mark as read when selecting
    if (submissionId) {
      handleMarkAsRead(submissionId);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inquiries & Communications</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SubmissionsList 
            submissions={submissions}
            selectedSubmissionId={selectedSubmission}
            onSelectSubmission={handleSelectSubmission}
            isLoading={loading}
            error={error}
          />
        </div>
        
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <SubmissionDetail
              submission={submissions.find(s => s.id === selectedSubmission)}
              onSendResponse={(responseText) => handleSendResponse(responseText)}
              isSending={isSending}
              propertyId={property.id}
            />
          ) : (
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-muted-foreground">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
