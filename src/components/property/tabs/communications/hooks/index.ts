
// Re-export the hooks with renamed interfaces to avoid naming conflicts
import { 
  useMarkAsRead, 
  useSendResponse,
  UseMarkAsReadProps as MarkAsReadProps,
  UseSendResponseProps as SendResponseProps
} from './useSubmissionActions';
import { useSubmissionSelection } from './useSubmissionSelection';

export {
  useMarkAsRead,
  useSendResponse,
  useSubmissionSelection,
  // Export the renamed interfaces
  MarkAsReadProps as UseMarkAsReadProps,
  SendResponseProps as UseSendResponseProps
};
