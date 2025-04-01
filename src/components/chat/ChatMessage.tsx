
import React from 'react';
import { Message } from '@/services/chatService';
import ImageMessage from './ImageMessage';
import FileMessage from './FileMessage';
import UrlMessage from './UrlMessage';
import ButtonsMessage from './ButtonsMessage';

interface ChatMessageProps {
  message: Message;
  onButtonClick: (value: string, action?: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onButtonClick }) => {
  const { content, sender, timestamp, type } = message;
  
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
        return <p>{content}</p>;
    }
  };
  
  return (
    <div className={`flex flex-col ${sender === 'user' ? 'items-end' : 'items-start'} mb-4`}>
      <div className={sender === 'user' ? 'chat-message-user' : 'chat-message-bot'}>
        {renderMessageContent()}
      </div>
      <span className="text-xs text-gray-500 mt-1">{formattedTime}</span>
    </div>
  );
};

export default ChatMessage;
