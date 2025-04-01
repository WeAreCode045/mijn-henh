
import { SubmissionReply } from '@/types/submission';

export const processReplyData = (reply: any): SubmissionReply => {
  // Safely extract user data, providing defaults for missing properties
  const userData = reply.user || {};
  
  return {
    id: reply.id,
    submissionId: reply.submission_id,
    replyText: reply.reply_text,
    createdAt: reply.created_at,
    updatedAt: reply.updated_at,
    agentId: reply.agent_id,
    userId: reply.user_id || null,
    userName: userData.full_name || "Unknown User",
    userEmail: userData.email || "no-email@example.com",
    userPhone: userData.phone || "N/A",
    userAvatar: userData.avatar_url || null
  };
};
