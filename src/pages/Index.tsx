
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect to chat if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="text-center max-w-3xl px-4">
        <div className="bg-chat-dark p-4 rounded-full inline-block mb-6">
          <MessageSquare className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 text-chat-dark">Talktastic Hub</h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern chat application with AI-powered conversations, rich media support, and seamless authentication.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            className="bg-chat-user hover:bg-blue-600 text-white px-8"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/login')}
          >
            Learn More
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">AI-Powered Chat</h3>
            <p className="text-gray-600">
              Connect with our intelligent assistant through an n8n webhook for smart, contextual conversations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">Rich Message Support</h3>
            <p className="text-gray-600">
              Share and view images, files, links, and interactive buttons for enhanced communication.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">Secure Authentication</h3>
            <p className="text-gray-600">
              Industry-standard authentication with Authentik OIDC/OAuth2 integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
