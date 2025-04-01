
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  CheckIcon,
  XIcon,
  ArrowLeftIcon,
  Trash2Icon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/dateUtils";
import { useSubmissionReplies } from "../hooks/useSubmissionReplies";
import { SubmissionReplies } from "../SubmissionReplies";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  created_at: string;
  is_read: boolean;
}

interface SubmissionDetailProps {
  submission: Contact;
  onMarkAsRead: (isRead: boolean) => void;
  onReplyEmail: () => void;
  onBack: () => void;
  onRefresh: () => void;
  onDeleteReply: (replyId: string) => void;
}

export function SubmissionDetail({
  submission,
  onMarkAsRead,
  onReplyEmail,
  onBack,
  onRefresh,
  onDeleteReply,
}: SubmissionDetailProps) {
  const { replies, isLoading, error } = useSubmissionReplies(submission.id);
  const [expandedReplyIds, setExpandedReplyIds] = useState<Set<string>>(new Set());

  const toggleReplyExpansion = (replyId: string) => {
    setExpandedReplyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <CardTitle>{submission.name}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onMarkAsRead(!submission.is_read)}
            >
              {submission.is_read ? (
                <>
                  <XIcon className="h-4 w-4 mr-1" />
                  Mark as Unread
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Mark as Read
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
              {submission.email}
            </a>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
              {submission.phone}
            </a>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(submission.created_at)}
            </span>
          </div>
        </div>
        
        {/* Original Message */}
        <div className="mt-4 bg-muted p-4 rounded-md">
          <h4 className="font-semibold mb-2">Message:</h4>
          <p className="whitespace-pre-line">{submission.message}</p>
        </div>
        
        {/* Replies Section */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Replies</h4>
          {isLoading ? (
            <div className="text-center py-4">Loading replies...</div>
          ) : error ? (
            <div className="text-red-500 py-2">Error loading replies: {error}</div>
          ) : replies && replies.length > 0 ? (
            <SubmissionReplies 
              replies={replies} 
              expandedReplyIds={expandedReplyIds}
              onToggleReply={toggleReplyExpansion}
              onDeleteReply={onDeleteReply}
            />
          ) : (
            <div className="text-muted-foreground py-2 italic">No replies yet</div>
          )}
        </div>
        
        <Separator className="my-6" />
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button onClick={onReplyEmail}>
            <MailIcon className="h-4 w-4 mr-2" />
            Reply by Email
          </Button>
          {submission.phone && (
            <Button variant="outline" asChild>
              <a href={`tel:${submission.phone}`}>
                <PhoneIcon className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
