
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSubmitting: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isSubmitting }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '' || isSubmitting) return;
    
    onSendMessage(message);
    setMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end border border-chat-border rounded-lg bg-white overflow-hidden">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] max-h-[200px] border-0 focus-visible:ring-0 resize-none py-3 px-4"
          disabled={isSubmitting}
        />
        <div className="flex items-center pr-2 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isSubmitting}
            className="h-9 w-9"
            aria-label="Attach file"
            onClick={() => alert('File upload would be implemented in a production app')}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isSubmitting || message.trim() === ''}
            className="h-9 w-9 bg-primary"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
