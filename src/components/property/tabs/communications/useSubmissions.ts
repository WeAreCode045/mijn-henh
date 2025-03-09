
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Agent {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface SubmissionReply {
  id: string;
  submissionId: string;
  replyText: string;
  createdAt: string;
  agent: Agent | null;
}

interface Property {
  id: string;
  title: string;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  createdAt: string;
  isRead: boolean;
  property: Property;
  replies: SubmissionReply[];
}

export function useSubmissions(propertyId: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      
      try {
        // Fetch submissions for this property
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('property_contact_submissions')
          .select(`
            *,
            property:property_id(id, title)
          `)
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false });
          
        if (submissionsError) {
          console.error('Error fetching submissions:', submissionsError);
          return;
        }
        
        // Now fetch all replies for these submissions
        const submissionIds = submissionsData.map(s => s.id);
        
        const { data: repliesData, error: repliesError } = await supabase
          .from('property_submission_replies')
          .select(`
            id, 
            submission_id,
            reply_text,
            created_at,
            agent:agent_id(
              id, 
              full_name, 
              email, 
              photo_url
            )
          `)
          .in('submission_id', submissionIds)
          .order('created_at', { ascending: true });
          
        if (repliesError) {
          console.error('Error fetching replies:', repliesError);
        }
        
        // Transform data to match our expected format
        const formattedSubmissions = submissionsData.map(submission => {
          // Find all replies for this submission
          const submissionReplies = (repliesData || [])
            .filter(reply => reply.submission_id === submission.id)
            .map(reply => ({
              id: reply.id,
              submissionId: reply.submission_id,
              replyText: reply.reply_text,
              createdAt: reply.created_at,
              agent: reply.agent ? {
                id: reply.agent.id,
                name: reply.agent.full_name,
                email: reply.agent.email,
                photoUrl: reply.agent.photo_url
              } : null
            }));
            
          return {
            id: submission.id,
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            message: submission.message,
            inquiryType: submission.inquiry_type,
            createdAt: submission.created_at,
            isRead: submission.is_read,
            property: {
              id: submission.property.id,
              title: submission.property.title
            },
            replies: submissionReplies
          };
        });
        
        setSubmissions(formattedSubmissions);
        
        // Set the first submission as selected if there's no currently selected one
        if (formattedSubmissions.length > 0 && !selectedSubmission) {
          setSelectedSubmission(formattedSubmissions[0]);
        }
        
      } catch (error) {
        console.error('Error in useSubmissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (propertyId) {
      fetchSubmissions();
    }
    
  }, [propertyId]);
  
  return {
    submissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission
  };
}
