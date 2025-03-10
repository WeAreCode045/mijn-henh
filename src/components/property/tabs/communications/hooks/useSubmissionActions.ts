
import { useMarkAsRead } from './useMarkAsRead';
import { useSendResponse } from './useSendResponse';

export function useSubmissionActions(submissionId: string, isRead: boolean, onRefresh: () => Promise<void>) {
  const { markAsRead, isMarking } = useMarkAsRead({
    submission_id: submissionId,
    is_read: isRead,
    onSuccess: onRefresh
  });

  const { sendResponse, isSending } = useSendResponse({
    submissionId,
    onSuccess: onRefresh
  });

  return {
    markAsRead,
    isMarking,
    sendResponse,
    isSending
  };
}
