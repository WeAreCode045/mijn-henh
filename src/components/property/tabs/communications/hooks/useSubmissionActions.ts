
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { Submission } from "../types";
import { useMarkAsRead } from "./useMarkAsRead";
import { useSendResponse } from "./useSendResponse";

interface UseSubmissionActionsProps {
  propertyId: string;
  refreshSubmissions: () => Promise<void>;
  selectedSubmission: Submission | null;
  setSelectedSubmission: (submission: Submission | null) => void;
  setSubmissions: (updater: (prevSubmissions: Submission[]) => Submission[]) => void;
}

export function useSubmissionActions({
  propertyId,
  refreshSubmissions,
  selectedSubmission,
  setSelectedSubmission,
  setSubmissions
}: UseSubmissionActionsProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { settings } = useAgencySettings();
  
  const { handleMarkAsRead } = useMarkAsRead({ 
    setSubmissions, 
    setSelectedSubmission, 
    toast 
  });
  
  const { handleSendResponse } = useSendResponse({
    selectedSubmission,
    refreshSubmissions,
    settings,
    toast,
    setIsSending
  });

  return {
    isSending,
    handleMarkAsRead,
    handleSendResponse
  };
}
