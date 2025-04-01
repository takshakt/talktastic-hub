
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageMessageProps {
  src: string;
}

const ImageMessage: React.FC<ImageMessageProps> = ({ src }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="chat-image-card">
      {isLoading && (
        <div className="w-full h-48">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <img 
        src={src} 
        alt="Image message" 
        className={`max-w-full ${isLoading ? 'hidden' : 'block'}`}
        onLoad={() => setIsLoading(false)} 
        onError={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ImageMessage;
