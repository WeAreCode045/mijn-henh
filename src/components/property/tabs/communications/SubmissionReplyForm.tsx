
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface SubmissionReplyFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  placeholder?: string;
  recipientEmail?: string;
}

export function SubmissionReplyForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  placeholder = "Type your reply here...",
  recipientEmail
}: SubmissionReplyFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {recipientEmail && (
        <div className="space-y-2">
          <Label htmlFor="recipient">To:</Label>
          <Input 
            id="recipient"
            value={recipientEmail}
            readOnly
            className="bg-muted"
          />
        </div>
      )}
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px]"
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!value.trim() || isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? "Sending..." : "Send Reply"}
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
