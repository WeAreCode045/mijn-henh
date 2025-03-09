
import { format } from 'date-fns';
import { SubmissionReplies } from './SubmissionReplies';
import { SubmissionResponse } from './SubmissionResponse';
import { useEffect } from 'react';
import { CheckIcon, MailIcon, PhoneIcon, TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Submission, SubmissionDetailProps } from './types';

export function SubmissionDetail({ 
  submission, 
  onSendResponse, 
  isSending,
  onMarkAsRead 
}: SubmissionDetailProps) {
  useEffect(() => {
    // Change page title when submission changes
    if (submission) {
      document.title = `Inquiry from ${submission.name} - Property Portal`;
      return () => {
        document.title = 'Property Portal';
      };
    }
  }, [submission]);

  if (!submission) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 border rounded-lg">
        <p className="text-gray-500">Select a message to view details</p>
      </div>
    );
  }

  const getInquiryTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'information': 'Meer informatie',
      'viewing': 'Bezichtiging',
      'offer': 'Bod',
      'other': 'Overig'
    };
    return types[type] || type;
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{submission.name}</h2>
            <p className="text-sm text-gray-500">
              {format(new Date(submission.created_at), 'dd MMM yyyy HH:mm')}
            </p>
          </div>
          
          {!submission.is_read && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onMarkAsRead(submission.id)}
              className="flex items-center gap-1"
            >
              <CheckIcon className="h-4 w-4" />
              Mark as read
            </Button>
          )}
        </div>
        
        {/* Subject and type */}
        <div className="mt-3 flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-blue-500" />
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
            {getInquiryTypeLabel(submission.inquiry_type)}
          </span>
        </div>
        
        {/* Property info */}
        {submission.property && (
          <div className="mt-2 text-sm text-gray-600">
            Property: <span className="font-medium">{submission.property.title}</span>
          </div>
        )}
      </div>
      
      {/* Contact details */}
      <div className="p-6 border-b bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MailIcon className="h-4 w-4 text-gray-500" />
            <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
              {submission.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-gray-500" />
            <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
              {submission.phone}
            </a>
          </div>
        </div>
      </div>
      
      {/* Message content */}
      <div className="p-6 border-b">
        <h3 className="font-medium mb-2">Message</h3>
        <p className="text-gray-700 whitespace-pre-line">{submission.message}</p>
      </div>
      
      {/* Replies */}
      <div className="p-6 border-b bg-gray-50">
        <h3 className="font-medium mb-3">Conversation</h3>
        <SubmissionReplies replies={submission.replies || []} />
      </div>
      
      {/* Response form */}
      <div className="p-6">
        <SubmissionResponse 
          onSendResponse={onSendResponse}
          isSending={isSending}
        />
      </div>
    </div>
  );
}
