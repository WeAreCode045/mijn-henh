
import { useFetchSubmissions } from './useFetchSubmissions';
import { useMarkAsRead } from './useMarkAsRead';
import { useSendResponse } from './useSendResponse';
import { useSubmissionActions } from './useSubmissionActions';
import { useSubmissionSelection } from './useSubmissionSelection';

// Re-export hooks
export { useFetchSubmissions, useMarkAsRead, useSendResponse, useSubmissionActions, useSubmissionSelection };

// Re-export types using 'export type' to fix TS1205 error
export type { UseMarkAsReadProps } from './useMarkAsRead';
export type { UseSendResponseProps } from './useSendResponse';
