
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';

interface SubmissionResponseProps {
  onSendResponse: (responseText: string) => Promise<void>;
  isSending: boolean;
}

export function SubmissionResponse({ onSendResponse, isSending }: SubmissionResponseProps) {
  const [responseText, setResponseText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    
    await onSendResponse(responseText);
    setResponseText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-medium mb-2">Send a reply</h3>
      <Textarea
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        placeholder="Type your response..."
        className="min-h-[120px]"
        disabled={isSending}
      />
      <Button 
        type="submit" 
        className="mt-2 w-full md:w-auto" 
        disabled={!responseText.trim() || isSending}
      >
        {isSending ? (
          <>
            <span className="animate-spin mr-2">○</span>
            Sending...
          </>
        ) : (
          <>
            <SendIcon className="w-4 h-4 mr-2" />
            Send Response
          </>
        )}
      </Button>
    </form>
  );
}
