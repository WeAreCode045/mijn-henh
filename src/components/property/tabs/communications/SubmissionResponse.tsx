
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export interface SubmissionResponseProps {
  value: string;
  onChange: (value: string) => void;
  isSending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SubmissionResponse({ 
  value, 
  onChange, 
  isSending, 
  onSubmit 
}: SubmissionResponseProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        placeholder="Type your response here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        disabled={isSending}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!value.trim() || isSending}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isSending ? 'Sending...' : 'Send Response'}
        </Button>
      </div>
    </form>
  );
}
