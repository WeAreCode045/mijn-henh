import { useState } from 'react';
import { SubmissionsList } from '../communications/SubmissionsList';
import { SubmissionDetail } from '../communications/SubmissionDetail';
import { useFetchSubmissions } from '../communications/hooks';

export const CommunicationsTabContent = ({ propertyId }: { propertyId: string }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { submissions, isLoading, refreshSubmissions } = useFetchSubmissions({ propertyId });

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r p-4">
        <SubmissionsList
          submissions={submissions}
          selectedSubmissionId={selectedSubmission?.id || ''}
          onSelectSubmission={setSelectedSubmission}
        />
      </div>
      <div className="flex-1 p-4">
        {selectedSubmission ? (
          <SubmissionDetail
            submission={selectedSubmission}
            onRefresh={refreshSubmissions}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            Select a submission to view details.
          </div>
        )}
      </div>
    </div>
  );
};
