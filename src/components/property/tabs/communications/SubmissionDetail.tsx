
import React, { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { SubmissionResponse } from './SubmissionResponse';
import { SubmissionReplies } from './SubmissionReplies';
import { Submission, Reply } from './useSubmissions';

interface SubmissionDetailProps {
  submission: Submission;
  propertyTitle: string;
  onMarkAsRead: (id: string) => void;
  onSendResponse: (id: string, message: string) => Promise<void>;
}

export function SubmissionDetail({
  submission,
  propertyTitle,
  onMarkAsRead,
  onSendResponse
}: SubmissionDetailProps) {
  const [responseText, setResponseText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    
    setIsSending(true);
    try {
      await onSendResponse(submission.id, responseText);
      setResponseText('');
    } catch (error) {
      console.error('Failed to send response:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getInquiryTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'information': 'Meer informatie',
      'viewing': 'Bezichtiging',
      'offer': 'Bod'
    };
    return types[type] || type;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">
              {submission.name}
              {!submission.is_read && (
                <Badge variant="default" className="ml-2 bg-blue-500">
                  Nieuw
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {getInquiryTypeLabel(submission.inquiry_type)}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(submission.created_at)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">E-mail:</p>
            <p className="font-medium">
              <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                {submission.email}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Telefoon:</p>
            <p className="font-medium">
              <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                {submission.phone}
              </a>
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">Bericht:</p>
        <p className="mb-4">{submission.message}</p>
        
        {submission.replies && submission.replies.length > 0 && (
          <>
            <Separator className="my-4" />
            <SubmissionReplies replies={submission.replies as Reply[]} />
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <SubmissionResponse
          message={responseText}
          setMessage={setResponseText}
          isSending={isSending}
          onSubmit={handleSubmit}
        />
      </CardFooter>
    </Card>
  );
}
