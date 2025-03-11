
import { useState } from 'react';
import { useSubmissions } from '../communications/hooks/useSendResponse';
import { useMarkAsRead } from '../communications/hooks/useMarkAsRead';
import { useSendResponse } from '../communications/hooks/useSendResponse';
import { useAuth } from '@/providers/AuthProvider';
import { Submission } from '@/types/submission';

export function CommunicationsTabContent({ property }: { property: { id: string } }) {
  const { user } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Use the hooks with the correct property access
  const { submissions, isLoading, error, refetch } = useSubmissions(property.id);
  const { markAsRead, handleMarkAsRead, isMarking } = useMarkAsRead(
    selectedSubmission?.id || '',
    refetch
  );
  const { sendResponse, handleSendResponse, isSending } = useSendResponse(
    selectedSubmission?.id || '', 
    user?.id || '',
    refetch
  );

  // Function to transform submissions to match the required type
  const transformSubmissions = (): Submission[] => {
    return submissions.map(sub => ({
      id: sub.id,
      property_id: sub.property_id,
      name: sub.name,
      email: sub.email,
      phone: sub.phone,
      message: sub.message || '',
      inquiry_type: sub.inquiry_type,
      is_read: sub.is_read,
      created_at: sub.created_at,
      updated_at: sub.updated_at,
      agent_id: sub.agent_id,
      agent: sub.agent ? {
        id: sub.agent.id,
        full_name: sub.agent.full_name,
        email: sub.agent.email,
        phone: sub.agent.phone || '',
        avatar_url: sub.agent.avatar_url || ''
      } : undefined,
      replies: sub.replies || []
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        {isLoading ? (
          <p>Loading submissions...</p>
        ) : error ? (
          <p>Error loading submissions: {error.message}</p>
        ) : (
          <div>
            <h2>Submissions</h2>
            {transformSubmissions().length === 0 ? (
              <p>No submissions found</p>
            ) : (
              <ul>
                {transformSubmissions().map(submission => (
                  <li 
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`p-2 cursor-pointer ${selectedSubmission?.id === submission.id ? 'bg-gray-100' : ''}`}
                  >
                    {submission.name} - {submission.inquiry_type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      <div>
        {selectedSubmission && (
          <div>
            {/* Use the SubmissionDetail component with proper prop names */}
            <div className="p-4 border rounded-md">
              <h3>{selectedSubmission.name}</h3>
              <p>Email: {selectedSubmission.email}</p>
              <p>Type: {selectedSubmission.inquiry_type}</p>
              <p>Message: {selectedSubmission.message}</p>
              
              {!selectedSubmission.is_read && (
                <button 
                  onClick={handleMarkAsRead} 
                  disabled={isMarking}
                >
                  Mark as Read
                </button>
              )}
              
              <div className="mt-4">
                <h4>Reply</h4>
                <textarea className="w-full p-2 border" />
                <button 
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    if (textarea) handleSendResponse(textarea.value);
                  }}
                  disabled={isSending}
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
