
import { useState } from "react";
import { Submission } from "../types";

export function useSubmissionSelection() {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  return {
    selectedSubmission,
    setSelectedSubmission
  };
}
