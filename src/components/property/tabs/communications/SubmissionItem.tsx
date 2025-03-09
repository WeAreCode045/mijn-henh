
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MailOpenIcon } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface Property {
  id: string;
  title: string;
}

interface SubmissionReply {
  id: string;
  submissionId: string;
  replyText: string;
  createdAt: string;
  agent: Agent | null;
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

interface SubmissionItemProps {
  submission: Submission;
  isSelected: boolean;
  onClick: () => void;
  onMarkAsRead: (submissionId: string) => void;
}

export function SubmissionItem({ 
  submission, 
  isSelected, 
  onClick,
  onMarkAsRead
}: SubmissionItemProps) {
  const formattedDate = format(new Date(submission.createdAt), 'MMM d');
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick of the parent
    onMarkAsRead(submission.id);
  };
  
  return (
    <div 
      className={`
        p-3 rounded-md cursor-pointer transition-colors
        ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}
        ${!submission.isRead ? 'ring-1 ring-primary' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div className="font-medium truncate">{submission.name}</div>
        <div className="text-xs text-muted-foreground">{formattedDate}</div>
      </div>
      
      <div className="mt-1 text-sm truncate text-muted-foreground">
        {submission.message}
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {submission.inquiryType}
        </Badge>
        
        {!submission.isRead && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6" 
            onClick={handleMarkAsRead}
            title="Mark as read"
          >
            <MailOpenIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
