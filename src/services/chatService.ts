
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
const DEFAULT_WEBHOOK_URL = 'https://n8n.example.com/webhook/chat';

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

      // For demo purposes, we'll simulate API responses
      // In a real implementation, you would uncomment the fetch call below
      
      /*
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      */
      
      // For demonstration purposes, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly choose message type for demo purposes
      const responseTypes: MessageType[] = ['text', 'image', 'file', 'url', 'buttons'];
      const randomType = responseTypes[Math.floor(Math.random() * responseTypes.length)];
      
      let responseContent = '';
      let buttons: Button[] | undefined;
      let urlMetadata: UrlMetadata | undefined;
      
      switch (randomType) {
        case 'text':
          responseContent = `This is a simulated response to: "${message}"`;
          break;
        case 'image':
          responseContent = 'https://source.unsplash.com/random/400x300';
          break;
        case 'file':
          responseContent = 'example-document.pdf';
          break;
        case 'url':
          responseContent = 'https://lovable.dev';
          urlMetadata = {
            title: 'Lovable - Build Web Apps with AI',
            description: 'Lovable is an AI-powered platform for building web applications.',
            thumbnail: 'https://lovable.dev/opengraph-image-p98pqg.png',
            url: 'https://lovable.dev'
          };
          break;
        case 'buttons':
          responseContent = 'Would you like to continue?';
          buttons = [
            { text: 'Yes', value: 'yes', action: 'continue' },
            { text: 'No', value: 'no', action: 'stop' }
          ];
          break;
        default:
          responseContent = 'Sorry, I didn\'t understand that.';
      }
      
      return {
        id: messageId,
        content: responseContent,
        sender: 'bot',
        timestamp,
        type: randomType,
        buttons,
        urlMetadata
      };
    } catch (error) {
      console.error('Error sending message to webhook:', error);
      throw error;
    }
  }
  
  // Process button interactions
  async handleButtonClick(buttonValue: string, action: string | undefined, user: User): Promise<Message> {
    try {
      // Simulate processing button click
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: Math.random().toString(36).substring(2, 15),
        content: `You selected: ${buttonValue}${action ? ` (action: ${action})` : ''}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
    } catch (error) {
      console.error('Error handling button click:', error);
      throw error;
    }
  }
  
  // Fetch URL metadata
  async fetchUrlMetadata(url: string): Promise<UrlMetadata> {
    try {
      // In a real implementation, you would call a metadata service
      // For demo purposes, we'll return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
