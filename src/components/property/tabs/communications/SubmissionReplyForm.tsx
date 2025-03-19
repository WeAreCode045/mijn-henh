
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SubmissionReplyFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function SubmissionReplyForm({ 
  value, 
  onChange, 
  onSubmit, 
  isSubmitting 
}: SubmissionReplyFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea 
        className="w-full p-2 border rounded resize-none"
        rows={4}
        placeholder="Type your reply here..."
        value={value}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        className="mt-2"
        disabled={isSubmitting || !value.trim()}
      >
        {isSubmitting ? 'Sending...' : 'Send Reply'}
      </Button>
    </form>
  );
}
