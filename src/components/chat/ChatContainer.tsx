
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import chatService, { Message } from '@/services/chatService';
import { useAuth } from '@/contexts/AuthContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [geolocation, setGeolocation] = useState<GeolocationPosition | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Request geolocation permission on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation(position);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location access denied",
            description: "We couldn't access your location. Some features may be limited.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to send messages.",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message to chat
    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsSubmitting(true);
    
    try {
      // Add typing indicator (will be replaced by actual response)
      const typingIndicatorId = Math.random().toString(36).substring(2, 15);
      setMessages((prev) => [
        ...prev, 
        {
          id: typingIndicatorId,
          content: '',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
      
      // Send message to chat service (webhook)
      const botResponse = await chatService.sendMessage(
        content, 
        user, 
        isFirstMessage,
        geolocation || undefined
      );
      
      // If this was the first message, update state
      if (isFirstMessage) {
        setIsFirstMessage(false);
      }
      
      // Remove typing indicator and add actual response
      setMessages((prev) => 
        prev.filter(m => m.id !== typingIndicatorId).concat(botResponse)
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message failed",
        description: "We couldn't send your message. Please try again.",
        variant: "destructive",
      });
      
      // Remove typing indicator if present
      setMessages((prev) => 
        prev.filter(m => m.sender !== 'bot' || m.content !== '')
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle button interactions
  const handleButtonClick = async (value: string, action?: string) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Add user's button selection as a message
      const userMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        content: `Selected: ${value}`,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages((prev) => [...prev, userMessage]);
      
      // Process the button click
      const botResponse = await chatService.handleButtonClick(value, action, user);
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error handling button click:', error);
      toast({
        title: "Action failed",
        description: "We couldn't process your selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Create welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          content: 'Welcome to Talktastic Hub! How can I help you today?',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
    }
  }, [messages.length]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onButtonClick={handleButtonClick} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Typing indicator - shown when isSubmitting is true */}
      {isSubmitting && messages[messages.length - 1]?.sender !== 'bot' && (
        <div className="px-4 mb-4">
          <div className="chat-message-bot inline-block">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-chat-border p-4">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default ChatContainer;
