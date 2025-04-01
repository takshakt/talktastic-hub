
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic, Image } from 'lucide-react';

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
      <div className="flex items-end border border-chat-border rounded-xl bg-white overflow-hidden shadow-sm">
        <div className="flex items-center pl-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isSubmitting}
            className="h-9 w-9 text-gray-500 hover:text-gray-700"
            aria-label="Attach file"
            onClick={() => alert('File upload would be implemented in a production app')}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isSubmitting}
            className="h-9 w-9 text-gray-500 hover:text-gray-700"
            aria-label="Attach image"
            onClick={() => alert('Image upload would be implemented in a production app')}
          >
            <Image className="h-5 w-5" />
          </Button>
        </div>
        
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] max-h-[200px] flex-1 border-0 focus-visible:ring-0 resize-none py-3 px-4"
          disabled={isSubmitting}
        />
        
        <div className="flex items-center px-2 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isSubmitting}
            className="h-9 w-9 text-gray-500 hover:text-gray-700 mr-1"
            aria-label="Voice message"
            onClick={() => alert('Voice messages would be implemented in a production app')}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isSubmitting || message.trim() === ''}
            className="h-10 w-10 rounded-full bg-primary transition-all hover:bg-primary/90 hover:scale-105"
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
