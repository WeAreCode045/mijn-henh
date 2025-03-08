
import { useCallback } from "react";
import { useFetchSubmissions } from "./hooks/useFetchSubmissions";
import { useSubmissionSelection } from "./hooks/useSubmissionSelection";
import { useSubmissionActions } from "./hooks/useSubmissionActions";

export type { Submission } from "./types";

export function useSubmissions(propertyId: string) {
  const { 
    submissions, 
    isLoading, 
    refreshSubmissions,
    setSubmissions
  } = useFetchSubmissions(propertyId);
  
  const { 
    selectedSubmission, 
    setSelectedSubmission 
  } = useSubmissionSelection();
  
  const { 
    isSending, 
    handleMarkAsRead, 
    handleSendResponse 
  } = useSubmissionActions({
    propertyId,
    refreshSubmissions,
    selectedSubmission,
    setSelectedSubmission,
    setSubmissions
  });

  return {
    submissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    isSending,
    handleMarkAsRead,
    handleSendResponse,
    refreshSubmissions
  };
}
