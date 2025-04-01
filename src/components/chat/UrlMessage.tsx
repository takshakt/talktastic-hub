
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { UrlMetadata } from '@/services/chatService';

interface UrlMessageProps {
  metadata?: UrlMetadata;
}

const UrlMessage: React.FC<UrlMessageProps> = ({ metadata }) => {
  if (!metadata) {
    return <p>Link could not be loaded</p>;
  }
  
  return (
    <a 
      href={metadata.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block w-full max-w-sm border border-chat-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      {metadata.thumbnail && (
        <div className="w-full h-32 bg-gray-100 overflow-hidden">
          <img 
            src={metadata.thumbnail} 
            alt={metadata.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm text-left">{metadata.title}</h3>
          <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-left line-clamp-2">{metadata.description}</p>
      </div>
    </a>
  );
};

export default UrlMessage;
