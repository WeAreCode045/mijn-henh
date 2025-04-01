
import { useState } from 'react';
import { processReplyData } from '../utils/submissionUtils';
import { Submission, SubmissionReply } from '../types/submissionTypes';

export function usePropertySubmissions() {
  // Add specific submission handling that doesn't overlap with usePropertyFeaturedImages
  
  // Handle reply data processing
  const processReplies = (replies: any[]): SubmissionReply[] => {
    if (!replies || !Array.isArray(replies)) return [];
    
    return replies.map(reply => processReplyData(reply));
  };
  
  return {
    processReplies
  };
}
