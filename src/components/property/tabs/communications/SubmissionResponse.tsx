
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';
import { SubmissionResponseProps } from './types';

export function SubmissionResponse({ onSendResponse, isSending }: SubmissionResponseProps) {
  const [responseText, setResponseText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    
    try {
      await onSendResponse(responseText);
      setResponseText(''); // Clear the response text after successful send
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-medium mb-2">Reply</h3>
      <Textarea
        placeholder="Type your response here..."
        className="min-h-[120px] mb-3"
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
      />
      <Button 
        type="submit" 
        className="flex items-center gap-2"
        disabled={!responseText.trim() || isSending}
      >
        <SendIcon className="h-4 w-4" />
        {isSending ? 'Sending...' : 'Send Response'}
      </Button>
    </form>
  );
}
