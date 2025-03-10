
import React, { FormEvent, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface SubmissionResponseProps {
  responseText: string;
  setResponseText: Dispatch<SetStateAction<string>>;
  isSending: boolean;
  onSubmit: (e: FormEvent) => Promise<void>;
}

export function SubmissionResponse({ 
  responseText, 
  setResponseText, 
  isSending, 
  onSubmit 
}: SubmissionResponseProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <Textarea
          placeholder="Type your response..."
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          rows={5}
          className="resize-none"
          required
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSending || !responseText.trim()}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send Reply'}
          </Button>
        </div>
      </div>
    </form>
  );
}
