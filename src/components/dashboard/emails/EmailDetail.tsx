
import React from "react";
import { Email } from "./EmailItem";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, User, Calendar } from "lucide-react";

interface EmailDetailProps {
  email: Email | null;
}

export const EmailDetail = ({ email }: EmailDetailProps) => {
  if (!email) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground border rounded-lg p-6">
        <div className="text-center">
          <Mail className="mx-auto h-10 w-10 mb-4" />
          <p>Select an email to view details</p>
        </div>
      </div>
    );
  }

  // Format the date
  const date = new Date(email.date);
  const formattedDate = date.toLocaleString();

  return (
    <Card className="h-[400px] overflow-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{email.subject}</h2>
          
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <User className="h-4 w-4 mr-2" />
            <span>From: {email.from}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <User className="h-4 w-4 mr-2" />
            <span>To: {email.to}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          {/* Render HTML content if available, otherwise text content */}
          {email.htmlBody ? (
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: email.htmlBody }} 
            />
          ) : email.textBody ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{email.textBody}</div>
          ) : email.body ? (
            // Fallback to general body if available
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
          ) : (
            <p className="text-muted-foreground">No content available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
