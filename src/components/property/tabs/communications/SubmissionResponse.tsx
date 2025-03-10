
import React, { FormEvent, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface SubmissionResponseProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  isSending: boolean;
  onSubmit: (e: FormEvent) => Promise<void>;
}

export const SubmissionResponse = ({
  message,
  setMessage,
  isSending,
  onSubmit
}: SubmissionResponseProps) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type je antwoord hier..."
        className="mb-2"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!message.trim() || isSending}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isSending ? 'Versturen...' : 'Verstuur antwoord'}
        </Button>
      </div>
    </form>
  );
};
