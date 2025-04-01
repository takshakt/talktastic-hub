
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // The actual OAuth callback processing is handled in AuthContext
    // This component is just for UI during the process
    
    // After a brief delay, redirect to chat
    const timer = setTimeout(() => {
      navigate('/chat');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authenticating...</CardTitle>
          <CardDescription>
            We're completing your authentication with Authentik.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
