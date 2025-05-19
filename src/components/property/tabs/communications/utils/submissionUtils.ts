
import { SubmissionReply } from '../types/submissionTypes';

export const processReplyData = (reply: any): SubmissionReply => {
  // Safely extract user data, providing defaults for missing properties
  const userData = reply.user || {};
  
  return {
    id: reply.id,
    submission_id: reply.submission_id,
    reply_text: reply.reply_text,
    created_at: reply.created_at,
    updated_at: reply.updated_at,
    agent_id: reply.agent_id,
    user_id: reply.user_id || null,
    userName: userData.full_name || "Unknown User",
    userEmail: userData.email || "no-email@example.com",
    userPhone: userData.phone || "N/A",
    userAvatar: userData.avatar_url || null
  };
};
