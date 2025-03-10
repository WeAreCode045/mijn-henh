
import { useMarkAsRead } from './useMarkAsRead';
import { useSendResponse } from './useSendResponse';
import { useSubmissionSelection } from './useSubmissionSelection';

// Use export type for type definitions to avoid 'isolatedModules' issues
export { useMarkAsRead };
export { useSendResponse };
export { useSubmissionSelection };

// Re-export types
export type { UseMarkAsReadProps } from './useMarkAsRead';
export type { UseSendResponseProps } from './useSendResponse';
