
import React from 'react';
import { Message } from '@/services/chatService';
import ImageMessage from './ImageMessage';
import FileMessage from './FileMessage';
import UrlMessage from './UrlMessage';
import ButtonsMessage from './ButtonsMessage';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessageProps {
  message: Message;
  onButtonClick: (value: string, action?: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onButtonClick }) => {
  const { content, sender, timestamp, type } = message;
  const { user } = useAuth();
  
  // Format timestamp
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(timestamp));
  
  // Render based on message type
  const renderMessageContent = () => {
    switch (type) {
      case 'image':
        return <ImageMessage src={content} />;
      case 'file':
        return <FileMessage filename={content} />;
      case 'url':
        return <UrlMessage metadata={message.urlMetadata} />;
      case 'buttons':
        return (
          <>
            <p className="mb-2">{content}</p>
            <ButtonsMessage buttons={message.buttons || []} onButtonClick={onButtonClick} />
          </>
        );
      case 'text':
      default:
        return <p className="whitespace-pre-wrap">{content}</p>;
    }
  };
  
  const renderAvatar = () => {
    if (sender === 'user') {
      return (
        <Avatar className="h-8 w-8 border border-primary/10">
          <AvatarImage src={user?.picture || undefined} alt={user?.name || 'User'} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      );
    } else {
      return (
        <Avatar className="h-8 w-8 border border-slate-200">
          <AvatarImage src="/bot-avatar.png" alt="Bot" />
          <AvatarFallback className="bg-slate-100 text-slate-800">AI</AvatarFallback>
        </Avatar>
      );
    }
  };
  
  return (
    <div className={`flex gap-3 ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 items-start`}>
      {sender !== 'user' && renderAvatar()}
      
      <div className="flex flex-col max-w-[80%]">
        <div className={`py-3 px-4 rounded-2xl ${
          sender === 'user' 
            ? 'bg-gradient-to-r from-primary to-primary/90 text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        } shadow-sm`}>
          {renderMessageContent()}
        </div>
        <span className="text-xs text-gray-500 mt-1 self-start">
          {formattedTime}
        </span>
      </div>
      
      {sender === 'user' && renderAvatar()}
    </div>
  );
};

export default ChatMessage;
