
import { useMarkAsRead, UseMarkAsReadProps } from './useMarkAsRead';
import { useSendResponse, UseSendResponseProps } from './useSendResponse';
import { 
  useSubmissionSelection, 
  UseSubmissionSelectionProps, 
  UseSubmissionSelectionReturn 
} from './useSubmissionSelection';

// Re-export hooks with explicit type annotation
export type { UseMarkAsReadProps };
export type { UseSendResponseProps };
export type { UseSubmissionSelectionProps, UseSubmissionSelectionReturn };

export { useMarkAsRead };
export { useSendResponse };
export { useSubmissionSelection };
