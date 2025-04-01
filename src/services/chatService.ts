
import { User } from '@/contexts/AuthContext';

// Types for our chat system
export type MessageType = 'text' | 'image' | 'file' | 'url' | 'buttons';

export interface Button {
  text: string;
  value: string;
  action?: string;
}

export interface UrlMetadata {
  title: string;
  description: string;
  thumbnail?: string;
  url: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: MessageType;
  buttons?: Button[];
  urlMetadata?: UrlMetadata;
}

// Default webhook URL - in a real app, this would be configurable
const DEFAULT_WEBHOOK_URL = 'https://n8n.448.global/webhook/e3783f4d-c79b-419d-93f5-dcd3e8195abc';

class ChatService {
  private webhookUrl: string;

  constructor(webhookUrl: string = DEFAULT_WEBHOOK_URL) {
    this.webhookUrl = webhookUrl;
  }

  // Set webhook URL
  setWebhookUrl(url: string) {
    this.webhookUrl = url;
  }

  // Send message to the webhook
  async sendMessage(
    message: string, 
    user: User, 
    isFirstMessage: boolean,
    geolocation?: GeolocationPosition
  ): Promise<Message> {
    try {
      const timestamp = new Date();
      const messageId = Math.random().toString(36).substring(2, 15);
      
      // Create payload for n8n webhook
      const payload = {
        message,
        sessionId: user?.sessionId || 'anonymous',
        timestamp: timestamp.toISOString(),
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          location: user.location,
          sex: user.sex
        } : null,
        isFirstMessage,
        geolocation: geolocation ? {
          latitude: geolocation.coords.latitude,
          longitude: geolocation.coords.longitude,
          accuracy: geolocation.coords.accuracy
        } : null
      };

      console.log('Sending message to webhook:', this.webhookUrl);
      console.log('Payload:', JSON.stringify(payload));
      
      try {
        // Use fetch with proper error handling
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('Webhook response status:', response.status);
        
        // Check if response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Try to parse the response as JSON
        const responseText = await response.text();
        console.log('Webhook raw response:', responseText);
        
        let data;
        try {
          // Only try to parse as JSON if there's actual content
          data = responseText ? JSON.parse(responseText) : {};
          console.log('Webhook parsed response:', data);
        } catch (parseError) {
          console.error('Error parsing response as JSON:', parseError);
          // If response is not JSON, use the text as content
          data = { 
            type: 'text',
            content: responseText || 'I received your message but could not understand the response.'
          };
        }
        
        // Process the response from webhook
        const responseType = data.type || 'text';
        const responseContent = data.content || (typeof data === 'string' ? data : 'No content provided');
        const responseButtons = data.buttons;
        const responseUrlMetadata = data.urlMetadata;
        
        return {
          id: messageId,
          content: responseContent,
          sender: 'bot',
          timestamp,
          type: responseType as MessageType,
          buttons: responseButtons,
          urlMetadata: responseUrlMetadata
        };
      } catch (fetchError) {
        console.error('Error with fetch operation:', fetchError);
        throw fetchError; // Re-throw to be caught by the outer try/catch
      }
    } catch (error) {
      console.error('Error sending message to webhook:', error);
      
      // Return error message
      return {
        id: Math.random().toString(36).substring(2, 15),
        content: 'Sorry, I encountered an error connecting to the AI service. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
    }
  }
  
  // Process button interactions
  async handleButtonClick(buttonValue: string, action: string | undefined, user: User): Promise<Message> {
    try {
      // Create payload for n8n webhook
      const payload = {
        button: {
          value: buttonValue,
          action: action
        },
        sessionId: user?.sessionId || 'anonymous',
        timestamp: new Date().toISOString(),
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          location: user.location,
          sex: user.sex
        } : null
      };

      console.log('Sending button click to webhook:', this.webhookUrl);
      console.log('Button payload:', JSON.stringify(payload));

      // Send button click to webhook with improved error handling
      try {
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('Button click response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('Button click raw response:', responseText);
        
        let data;
        try {
          data = responseText ? JSON.parse(responseText) : {};
          console.log('Button click parsed response:', data);
        } catch (parseError) {
          console.error('Error parsing button response as JSON:', parseError);
          data = { 
            type: 'text',
            content: responseText || `You selected: ${buttonValue}`
          };
        }
        
        const responseType = data.type || 'text';
        const responseContent = data.content || (typeof data === 'string' ? data : `You selected: ${buttonValue}`);
        
        return {
          id: Math.random().toString(36).substring(2, 15),
          content: responseContent,
          sender: 'bot',
          timestamp: new Date(),
          type: responseType as MessageType,
          buttons: data.buttons,
          urlMetadata: data.urlMetadata
        };
      } catch (fetchError) {
        console.error('Error with button click fetch operation:', fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error('Error handling button click:', error);
      return {
        id: Math.random().toString(36).substring(2, 15),
        content: `You selected: ${buttonValue}. (Error: Could not connect to AI service)`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
    }
  }
  
  // Fetch URL metadata
  async fetchUrlMetadata(url: string): Promise<UrlMetadata> {
    try {
      // In a real implementation, we would fetch metadata from the URL
      // For now, returning mock data
      return {
        title: 'Website Title',
        description: 'This is a description of the linked website content.',
        thumbnail: 'https://source.unsplash.com/random/400x200',
        url
      };
    } catch (error) {
      console.error('Error fetching URL metadata:', error);
      throw error;
    }
  }
}

export default new ChatService();
